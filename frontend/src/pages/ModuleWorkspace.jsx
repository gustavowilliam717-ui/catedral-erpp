import { useEffect, useMemo, useState } from "react";
import API from "../services/api";
import { findModulePage } from "../modules/erpModules";
import { logError } from "../utils/logger";

function emptyForm(fields) {
  return fields.reduce((acc, field) => {
    acc[field.key] = "";
    return acc;
  }, {});
}

function exportCsv(page, fields, records) {
  const header = ["id", ...fields.map((f) => f.label)];
  const rows = records.map((record) => [
    record.id,
    ...fields.map((f) => {
      const value = record.data?.[f.key] ?? "";
      return `"${String(value).replace(/"/g, '""')}"`;
    }),
  ]);
  const csv = [header.join(","), ...rows.map((r) => r.join(","))].join("\n");
  const blob = new Blob([`﻿${csv}`], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${page}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

export default function ModuleWorkspace({ page }) {
  const modulePage = findModulePage(page);
  const title = modulePage?.label || "Modulo";
  const group = modulePage?.group || "ERP";
  const module = modulePage?.module || "NEXT ERP";

  const [fields, setFields] = useState([]);
  const [records, setRecords] = useState([]);
  const [form, setForm] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;

    async function load() {
      setLoading(true);
      try {
        const [fieldsRes, recordsRes] = await Promise.all([
          API.get(`/modules/${page}/fields`),
          API.get(`/modules/${page}/records`),
        ]);
        if (!active) return;
        const loadedFields = fieldsRes.data?.fields || [];
        setFields(loadedFields);
        setForm(emptyForm(loadedFields));
        setRecords(recordsRes.data || []);
      } catch (error) {
        logError(error);
        if (active) setMessage("Nao foi possivel carregar este modulo.");
      } finally {
        if (active) setLoading(false);
      }
    }

    load();
    return () => {
      active = false;
    };
  }, [page]);

  async function reloadRecords() {
    try {
      const response = await API.get(`/modules/${page}/records`);
      setRecords(response.data || []);
    } catch (error) {
      logError(error);
    }
  }

  function update(key, value) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function startNew() {
    setEditingId(null);
    setForm(emptyForm(fields));
    setShowForm(true);
    setMessage("");
  }

  function editRecord(record) {
    setEditingId(record.id);
    setForm({ ...emptyForm(fields), ...record.data });
    setShowForm(true);
    setMessage("");
  }

  async function save(event) {
    event.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      if (editingId) {
        await API.put(`/modules/${page}/records/${editingId}`, form);
        setMessage("Registro atualizado.");
      } else {
        await API.post(`/modules/${page}/records`, form);
        setMessage("Registro cadastrado.");
      }
      setForm(emptyForm(fields));
      setEditingId(null);
      setShowForm(false);
      await reloadRecords();
    } catch (error) {
      logError(error);
      setMessage(error?.response?.data?.detail || "Nao foi possivel salvar.");
    } finally {
      setSaving(false);
    }
  }

  async function remove(id) {
    if (!window.confirm("Remover este registro?")) return;

    try {
      await API.delete(`/modules/${page}/records/${id}`);
      setMessage("Registro removido.");
      await reloadRecords();
    } catch (error) {
      logError(error);
      setMessage("Nao foi possivel remover.");
    }
  }

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return records;
    return records.filter((record) =>
      JSON.stringify(record).toLowerCase().includes(term)
    );
  }, [records, search]);

  function renderField(field) {
    if (field.type === "select") {
      return (
        <select
          key={field.key}
          value={form[field.key] || ""}
          onChange={(event) => update(field.key, event.target.value)}
        >
          <option value="">{field.label}</option>
          {(field.options || []).map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
      );
    }

    if (field.type === "textarea") {
      return (
        <textarea
          key={field.key}
          placeholder={field.label}
          value={form[field.key] || ""}
          onChange={(event) => update(field.key, event.target.value)}
        />
      );
    }

    return (
      <input
        key={field.key}
        type={field.type === "number" ? "number" : "text"}
        placeholder={field.label}
        value={form[field.key] || ""}
        onChange={(event) => update(field.key, event.target.value)}
      />
    );
  }

  return (
    <div className="page module-page">
      <section className="module-hero">
        <div>
          <span>{module}</span>
          <h1>{title}</h1>
          <p>
            Pasta ativa. Cadastre, filtre e exporte os registros deste modulo.
            Os campos abaixo seguem as regras definidas para {group}.
          </p>
        </div>
        <strong>{group}</strong>
      </section>

      <section className="module-grid">
        <div className="box">
          <h2>Status da pasta</h2>
          <div className="module-status-list">
            <span className="status-chip ok">Menu criado</span>
            <span className="status-chip ok">Cadastro ativo</span>
            <span className="status-chip ok">Listagem e filtros</span>
          </div>
        </div>

        <div className="box">
          <h2>Campos do modulo</h2>
          <ul className="need-list">
            {fields.map((field) => (
              <li key={field.key}>
                {field.label}
                <small style={{ opacity: 0.6 }}> ({field.type})</small>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="box">
        <div className="section-heading">
          <div>
            <span className="section-kicker">{group}</span>
            <h2>{title} - Registros</h2>
          </div>
          <div className="integration-actions">
            <button type="button" onClick={startNew}>
              + Novo registro
            </button>
            <button
              type="button"
              className="secondary"
              onClick={() => exportCsv(page, fields, filtered)}
              disabled={!filtered.length}
            >
              Exportar CSV
            </button>
          </div>
        </div>

        {message && <strong className="bulk-message">{message}</strong>}

        <input
          className="module-search"
          placeholder="Buscar registros"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          style={{ margin: "12px 0", width: "100%" }}
        />

        {showForm && (
          <form className="integration-form-grid" onSubmit={save}>
            {fields.map((field) => renderField(field))}
            <button type="submit" disabled={saving}>
              {saving ? "Salvando..." : editingId ? "Salvar alteracoes" : "Adicionar"}
            </button>
            <button type="button" className="secondary" onClick={() => setShowForm(false)}>
              Cancelar
            </button>
          </form>
        )}

        <table>
          <thead>
            <tr>
              {fields.map((field) => (
                <th key={field.key}>{field.label}</th>
              ))}
              <th>Acoes</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={fields.length + 1}>Carregando...</td>
              </tr>
            )}

            {!loading &&
              filtered.map((record) => (
                <tr key={record.id}>
                  {fields.map((field) => (
                    <td key={field.key}>{String(record.data?.[field.key] ?? "")}</td>
                  ))}
                  <td>
                    <button type="button" onClick={() => editRecord(record)}>
                      Editar
                    </button>
                    <button type="button" className="danger" onClick={() => remove(record.id)}>
                      Remover
                    </button>
                  </td>
                </tr>
              ))}

            {!loading && filtered.length === 0 && (
              <tr>
                <td colSpan={fields.length + 1}>Nenhum registro cadastrado ainda.</td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
}
