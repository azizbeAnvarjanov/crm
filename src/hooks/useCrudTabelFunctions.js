"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/client";
import { toast } from "react-hot-toast";
import * as XLSX from "xlsx";

export function useFetchRows(tableName) {
  const supabase = createClient();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchRows = async () => {
    await Promise.resolve();
    setLoading(true);
    const { data, error } = await supabase.rpc("get_rows", {
      table_name: tableName,
    });
    if (!error) {
      const normalized = Array.isArray(data) ? data.map((r) => r.data) : [];
      setRows(normalized);
    } else {
      console.error("fetch error:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    Promise.resolve().then(() => fetchRows());
  }, [tableName]);

  return { rows, loading, fetchRows };
}

export function useAddRow(fetchRows) {
  const supabase = createClient();

  const addRow = async (tableName, value, canEdit, title) => {
    if (!canEdit) return toast.error("Sizda huquq yo‘q!");
    if (!value) return toast.error("Qiymat kiritilishi kerak!");

    const { error } = await supabase.rpc("add_row", {
      table_name: tableName,
      row_name: value,
    });

    if (error) {
      console.error("add_row error:", error);
      return toast.error(`${title} yaratishda xatolik`);
    }

    toast.success(`${title} yaratildi!`);
    fetchRows();
  };

  return { addRow };
}

export function useUpdateRow(fetchRows) {
  const supabase = createClient();

  const updateRow = async (tableName, id, value, canEdit, title) => {
    if (!canEdit) return toast.error("Sizda huquq yo‘q!");
    if (!value) return toast.error("Qiymat kiritilishi kerak!");

    const { error } = await supabase.rpc("update_row", {
      table_name: tableName,
      row_id: id,
      new_name: value,
    });

    if (error) {
      console.error("update_row error:", error);
      return toast.error(`${title} yangilanishida xatolik`);
    }

    toast.success(`${title} yangilandi!`);
    fetchRows();
  };

  return { updateRow };
}

export function useDeleteRow(fetchRows) {
  const supabase = createClient();

  const deleteRow = async (tableName, ids, canDelete, title) => {
    if (!canDelete) return toast.error("Sizda huquq yo‘q!");
    const list = Array.isArray(ids) ? ids : [ids];

    for (const id of list) {
      const { error } = await supabase.rpc("delete_row", {
        table_name: tableName,
        row_id: id,
      });
      if (error) console.error("delete_row error:", error);
    }

    toast.success(`${list.length} ta ${title} o‘chirildi!`);
    fetchRows();
  };

  return { deleteRow };
}

export function useExportRows() {
  const exportRows = (tableName, title, rows, selected) => {
    const data = selected.length
      ? rows.filter((r) => selected.includes(r.id))
      : rows;
    if (!data.length) return toast.error("Ma'lumot yo‘q!");

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, title);
    XLSX.writeFile(workbook, `${tableName}.xlsx`);
    toast.success("Excel fayl yuklab olindi!");
  };

  return { exportRows };
}

export function useImportRows(fetchRows) {
  const supabase = createClient();

  const importRows = async (file, tableName, canEdit, title) => {
    if (!canEdit) return toast.error("Sizda huquq yo‘q!");
    const reader = new FileReader();

    reader.onload = async (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

      for (const row of worksheet) {
        const name = row.name || row.Nomi || row.title;
        if (!name) continue;

        await supabase.rpc("add_row", {
          table_name: tableName,
          row_name: name,
        });
      }

      toast.success(`${title} ma'lumotlari import qilindi!`);
      fetchRows();
    };

    reader.readAsArrayBuffer(file);
  };

  return { importRows };
}

export function useSelectRows() {
  const [selected, setSelected] = useState([]);

  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = (rows) => {
    setSelected((prev) =>
      prev.length === rows.length ? [] : rows.map((r) => r.id)
    );
  };

  return { selected, setSelected, toggleSelect, toggleSelectAll };
}
