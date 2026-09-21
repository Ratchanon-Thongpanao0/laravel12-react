import { useEffect, useState } from "react";

export default function Assets() {
    const [assets, setAssets] = useState([]);
    const [loading, setLoading] = useState(true);

    const [showForm, setShowForm] = useState(false);
    const [editingAsset, setEditingAsset] = useState(null);

    const [form, setForm] = useState({
        asset_code: "",
        name: "",
        type: "คอมพิวเตอร์",
        assigned_to: "",
        status: "ใช้งาน",
        maintenance_date: "",
        maintenance_note: "",
    });

    const [errors, setErrors] = useState({});

    // =========================
    // READ
    // =========================
    const fetchAssets = async () => {
        try {
            const response = await fetch("/api/assets");
            const data = await response.json();

            setAssets(data);
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAssets();
    }, []);

    // =========================
    // Form input
    // =========================
    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    // =========================
    // CREATE / UPDATE
    // =========================
    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});

        const url = editingAsset
            ? `/api/assets/${editingAsset.id}`
            : "/api/assets";

        const method = editingAsset ? "PUT" : "POST";

        try {
            const response = await fetch(url, {
                method: method,
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify(form),
            });

            const data = await response.json();

            if (!response.ok) {
                if (response.status === 422) {
                    setErrors(data.errors || {});
                    return;
                }

                throw new Error("เกิดข้อผิดพลาด");
            }

            closeForm();
            fetchAssets();
        } catch (error) {
            console.error("Error:", error);
        }
    };

    // =========================
    // EDIT
    // =========================
    const handleEdit = (asset) => {
        setEditingAsset(asset);

        setForm({
            asset_code: asset.asset_code || "",
            name: asset.name || "",
            type: asset.type || "คอมพิวเตอร์",
            assigned_to: asset.assigned_to || "",
            status: asset.status || "ใช้งาน",
            maintenance_date: asset.maintenance_date
                ? asset.maintenance_date.substring(0, 10)
                : "",
            maintenance_note: asset.maintenance_note || "",
        });

        setErrors({});
        setShowForm(true);
    };

    // =========================
    // DELETE
    // =========================
    const handleDelete = async (id) => {
        if (!confirm("ต้องการลบสินทรัพย์รายการนี้ใช่ไหม?")) {
            return;
        }

        try {
            const response = await fetch(`/api/assets/${id}`, {
                method: "DELETE",
                headers: {
                    Accept: "application/json",
                },
            });

            if (response.ok) {
                fetchAssets();
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    // =========================
    // Open Add Form
    // =========================
    const openCreateForm = () => {
        setEditingAsset(null);

        setForm({
            asset_code: "",
            name: "",
            type: "คอมพิวเตอร์",
            assigned_to: "",
            status: "ใช้งาน",
            maintenance_date: "",
            maintenance_note: "",
        });

        setErrors({});
        setShowForm(true);
    };

    // =========================
    // Close Form
    // =========================
    const closeForm = () => {
        setShowForm(false);
        setEditingAsset(null);
        setErrors({});

        setForm({
            asset_code: "",
            name: "",
            type: "คอมพิวเตอร์",
            assigned_to: "",
            status: "ใช้งาน",
            maintenance_date: "",
            maintenance_note: "",
        });
    };

    // =========================
    // Status Style
    // =========================
    const getStatusStyle = (status) => {
        if (status === "ใช้งาน") {
            return "bg-emerald-100 text-emerald-700";
        }

        if (status === "ซ่อม") {
            return "bg-amber-100 text-amber-700";
        }

        if (status === "เสีย") {
            return "bg-red-100 text-red-700";
        }

        return "bg-gray-100 text-gray-700";
    };

    // =========================
    // Maintenance Status
    // =========================
    const getMaintenanceStatus = (date) => {
        if (!date) {
            return {
                text: "ไม่ได้กำหนด",
                className: "bg-gray-100 text-gray-600",
            };
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const maintenanceDate = new Date(
            `${date.substring(0, 10)}T00:00:00`
        );
        maintenanceDate.setHours(0, 0, 0, 0);

        const diffTime = maintenanceDate - today;

        const diffDays = Math.ceil(
            diffTime / (1000 * 60 * 60 * 24)
        );

        if (diffDays < 0) {
            return {
                text: "เลยกำหนดแล้ว",
                className: "bg-red-100 text-red-700",
            };
        }

        if (diffDays === 0) {
            return {
                text: "ถึงกำหนดวันนี้",
                className: "bg-red-100 text-red-700",
            };
        }

        if (diffDays <= 7) {
            return {
                text: `อีก ${diffDays} วัน`,
                className: "bg-amber-100 text-amber-700",
            };
        }

        return {
            text: "ยังไม่ถึงกำหนด",
            className: "bg-emerald-100 text-emerald-700",
        };
    };

    // =========================
    // Maintenance Alert Assets
    // =========================
    const maintenanceAlerts = assets.filter((asset) => {
        if (!asset.maintenance_date) {
            return false;
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const maintenanceDate = new Date(
            `${asset.maintenance_date.substring(0, 10)}T00:00:00`
        );

        maintenanceDate.setHours(0, 0, 0, 0);

        const diffDays = Math.ceil(
            (maintenanceDate - today) /
                (1000 * 60 * 60 * 24)
        );

        return diffDays <= 7;
    });

    return (
        <div className="min-h-screen bg-slate-100">
            {/* Header */}
            <header className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-900 text-white shadow-lg">
                <div className="mx-auto max-w-7xl px-6 py-8">
                    <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                        <div>
                            <div className="mb-2 flex items-center gap-3">
                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-2xl backdrop-blur">
                                    🏢
                                </div>

                                <h1 className="text-3xl font-bold tracking-tight">
                                    Asset Management
                                </h1>
                            </div>

                            <p className="text-slate-300">
                                ระบบจัดการและติดตามสินทรัพย์ขององค์กร
                            </p>
                        </div>

                        <button
                            onClick={openCreateForm}
                            className="rounded-xl bg-indigo-500 px-6 py-3 font-semibold shadow-lg transition hover:bg-indigo-400 hover:shadow-xl active:scale-95"
                        >
                            ＋ เพิ่มสินทรัพย์
                        </button>
                    </div>
                </div>
            </header>

            {/* Main */}
            <main className="mx-auto max-w-7xl px-6 py-8">
                {/* Summary Cards */}
                <div className="mb-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
                        <p className="text-sm font-medium text-slate-500">
                            สินทรัพย์ทั้งหมด
                        </p>

                        <p className="mt-2 text-3xl font-bold text-slate-800">
                            {assets.length}
                        </p>
                    </div>

                    <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
                        <p className="text-sm font-medium text-slate-500">
                            กำลังใช้งาน
                        </p>

                        <p className="mt-2 text-3xl font-bold text-emerald-600">
                            {
                                assets.filter(
                                    (a) => a.status === "ใช้งาน"
                                ).length
                            }
                        </p>
                    </div>

                    <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
                        <p className="text-sm font-medium text-slate-500">
                            กำลังซ่อม
                        </p>

                        <p className="mt-2 text-3xl font-bold text-amber-500">
                            {
                                assets.filter(
                                    (a) => a.status === "ซ่อม"
                                ).length
                            }
                        </p>
                    </div>

                    <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
                        <p className="text-sm font-medium text-slate-500">
                            เสีย / รอซ่อม
                        </p>

                        <p className="mt-2 text-3xl font-bold text-red-500">
                            {
                                assets.filter(
                                    (a) => a.status === "เสีย"
                                ).length
                            }
                        </p>
                    </div>
                </div>

                {/* Maintenance Alerts */}
                {maintenanceAlerts.length > 0 && (
                    <div className="mb-8 rounded-2xl border border-amber-200 bg-amber-50 p-5">
                        <div className="flex items-start gap-3">
                            <div className="text-2xl">🔔</div>

                            <div className="flex-1">
                                <h3 className="font-bold text-amber-800">
                                    แจ้งเตือนการบำรุงรักษา
                                </h3>

                                <p className="mt-1 text-sm text-amber-700">
                                    มีสินทรัพย์ที่ถึงกำหนดหรือใกล้ถึงกำหนดบำรุงรักษา
                                </p>

                                <div className="mt-3 space-y-2">
                                    {maintenanceAlerts.map((asset) => (
                                        <div
                                            key={asset.id}
                                            className="rounded-xl bg-white/70 px-4 py-3 text-sm"
                                        >
                                            <span className="font-semibold text-slate-800">
                                                {asset.asset_code}
                                            </span>

                                            <span className="mx-2 text-slate-400">
                                                |
                                            </span>

                                            <span className="text-slate-700">
                                                {asset.name}
                                            </span>

                                            <span className="mx-2 text-slate-400">
                                                -
                                            </span>

                                            <span
                                                className={`rounded-full px-2 py-1 text-xs font-semibold ${
                                                    getMaintenanceStatus(
                                                        asset.maintenance_date
                                                    ).className
                                                }`}
                                            >
                                                {
                                                    getMaintenanceStatus(
                                                        asset.maintenance_date
                                                    ).text
                                                }
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Table */}
                <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
                    <div className="border-b border-slate-200 px-6 py-5">
                        <h2 className="text-xl font-bold text-slate-800">
                            รายการสินทรัพย์
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            ข้อมูลสินทรัพย์ทั้งหมดในระบบ
                        </p>
                    </div>

                    {loading ? (
                        <div className="p-12 text-center text-slate-500">
                            กำลังโหลดข้อมูล...
                        </div>
                    ) : assets.length === 0 ? (
                        <div className="p-16 text-center">
                            <div className="text-5xl">📦</div>

                            <h3 className="mt-4 text-lg font-semibold text-slate-700">
                                ยังไม่มีสินทรัพย์
                            </h3>

                            <p className="mt-1 text-sm text-slate-500">
                                เริ่มต้นด้วยการเพิ่มสินทรัพย์รายการแรก
                            </p>

                            <button
                                onClick={openCreateForm}
                                className="mt-5 rounded-xl bg-indigo-600 px-5 py-2.5 font-semibold text-white transition hover:bg-indigo-700"
                            >
                                ＋ เพิ่มสินทรัพย์
                            </button>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50 text-sm text-slate-500">
                                    <tr>
                                        <th className="px-6 py-4 font-semibold">
                                            รหัส
                                        </th>

                                        <th className="px-6 py-4 font-semibold">
                                            อุปกรณ์
                                        </th>

                                        <th className="px-6 py-4 font-semibold">
                                            ประเภท
                                        </th>

                                        <th className="px-6 py-4 font-semibold">
                                            ผู้ใช้งาน
                                        </th>

                                        <th className="px-6 py-4 font-semibold">
                                            สถานะ
                                        </th>

                                        <th className="px-6 py-4 font-semibold">
                                            การบำรุงรักษา
                                        </th>

                                        <th className="px-6 py-4 text-right font-semibold">
                                            จัดการ
                                        </th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-slate-100">
                                    {assets.map((asset) => (
                                        <tr
                                            key={asset.id}
                                            className="transition hover:bg-slate-50"
                                        >
                                            {/* Code */}
                                            <td className="px-6 py-5">
                                                <span className="rounded-lg bg-indigo-50 px-3 py-1.5 font-mono text-sm font-semibold text-indigo-700">
                                                    {asset.asset_code}
                                                </span>
                                            </td>

                                            {/* Name */}
                                            <td className="px-6 py-5">
                                                <div className="font-semibold text-slate-800">
                                                    {asset.name}
                                                </div>
                                            </td>

                                            {/* Type */}
                                            <td className="px-6 py-5 text-slate-600">
                                                {asset.type || "-"}
                                            </td>

                                            {/* Assigned */}
                                            <td className="px-6 py-5 text-slate-600">
                                                {asset.assigned_to ||
                                                    "ยังไม่ได้มอบหมาย"}
                                            </td>

                                            {/* Status */}
                                            <td className="px-6 py-5">
                                                <span
                                                    className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(
                                                        asset.status
                                                    )}`}
                                                >
                                                    {asset.status}
                                                </span>
                                            </td>

                                            {/* Maintenance */}
                                            <td className="px-6 py-5">
                                                {asset.maintenance_date ? (
                                                    <div>
                                                        <div className="font-medium text-slate-700">
                                                            {asset.maintenance_date.substring(
                                                                0,
                                                                10
                                                            )}
                                                        </div>

                                                        <span
                                                            className={`mt-1 inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                                                                getMaintenanceStatus(
                                                                    asset.maintenance_date
                                                                ).className
                                                            }`}
                                                        >
                                                            {
                                                                getMaintenanceStatus(
                                                                    asset.maintenance_date
                                                                ).text
                                                            }
                                                        </span>

                                                        {asset.maintenance_note && (
                                                            <p className="mt-2 max-w-xs text-sm text-slate-500">
                                                                {
                                                                    asset.maintenance_note
                                                                }
                                                            </p>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <span className="text-sm text-slate-400">
                                                        ไม่ได้กำหนด
                                                    </span>
                                                )}
                                            </td>

                                            {/* Actions */}
                                            <td className="px-6 py-5">
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        onClick={() =>
                                                            handleEdit(asset)
                                                        }
                                                        className="rounded-lg bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-600 transition hover:bg-blue-100"
                                                    >
                                                        ✏️ แก้ไข
                                                    </button>

                                                    <button
                                                        onClick={() =>
                                                            handleDelete(
                                                                asset.id
                                                            )
                                                        }
                                                        className="rounded-lg bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-100"
                                                    >
                                                        🗑️ ลบ
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </main>

            {/* Modal */}
            {showForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 px-4 backdrop-blur-sm">
                    <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white shadow-2xl">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between border-b border-slate-200 px-7 py-5">
                            <div>
                                <h2 className="text-2xl font-bold text-slate-800">
                                    {editingAsset
                                        ? "แก้ไขสินทรัพย์"
                                        : "เพิ่มสินทรัพย์"}
                                </h2>

                                <p className="mt-1 text-sm text-slate-500">
                                    กรอกข้อมูลสินทรัพย์ให้ครบถ้วน
                                </p>
                            </div>

                            <button
                                onClick={closeForm}
                                className="rounded-full bg-slate-100 px-3 py-2 text-slate-500 transition hover:bg-slate-200"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Form */}
                        <form
                            onSubmit={handleSubmit}
                            className="space-y-5 p-7"
                        >
                            {/* Asset Code */}
                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-700">
                                    รหัสสินทรัพย์
                                </label>

                                <input
                                    type="text"
                                    name="asset_code"
                                    value={form.asset_code}
                                    onChange={handleChange}
                                    placeholder="เช่น A001"
                                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                                />

                                {errors.asset_code && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {errors.asset_code[0]}
                                    </p>
                                )}
                            </div>

                            {/* Name */}
                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-700">
                                    ชื่ออุปกรณ์
                                </label>

                                <input
                                    type="text"
                                    name="name"
                                    value={form.name}
                                    onChange={handleChange}
                                    placeholder="เช่น Notebook Dell"
                                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                                />

                                {errors.name && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {errors.name[0]}
                                    </p>
                                )}
                            </div>

                            {/* Type */}
                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-700">
                                    ประเภทอุปกรณ์
                                </label>

                                <select
                                    name="type"
                                    value={form.type}
                                    onChange={handleChange}
                                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                                >
                                    <option value="คอมพิวเตอร์">
                                        💻 คอมพิวเตอร์
                                    </option>

                                    <option value="รถยนต์">
                                        🚗 รถยนต์
                                    </option>

                                    <option value="เครื่องมือ">
                                        🔧 เครื่องมือ
                                    </option>

                                    <option value="อุปกรณ์อื่นๆ">
                                        📦 อุปกรณ์อื่นๆ
                                    </option>
                                </select>

                                {errors.type && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {errors.type[0]}
                                    </p>
                                )}
                            </div>

                            {/* Assigned */}
                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-700">
                                    ผู้ยืม / ผู้ใช้งาน
                                </label>

                                <input
                                    type="text"
                                    name="assigned_to"
                                    value={form.assigned_to}
                                    onChange={handleChange}
                                    placeholder="เช่น สมชาย ใจดี"
                                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                                />

                                {errors.assigned_to && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {errors.assigned_to[0]}
                                    </p>
                                )}
                            </div>

                            {/* Status */}
                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-700">
                                    สถานะ
                                </label>

                                <select
                                    name="status"
                                    value={form.status}
                                    onChange={handleChange}
                                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                                >
                                    <option value="ใช้งาน">
                                        🟢 ใช้งาน
                                    </option>

                                    <option value="ซ่อม">
                                        🟡 กำลังซ่อม
                                    </option>

                                    <option value="เสีย">
                                        🔴 เสีย
                                    </option>

                                    <option value="ว่าง">
                                        ⚪ ว่าง
                                    </option>
                                </select>

                                {errors.status && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {errors.status[0]}
                                    </p>
                                )}
                            </div>

                            {/* Maintenance Date */}
                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-700">
                                    วันกำหนดบำรุงรักษา
                                </label>

                                <input
                                    type="date"
                                    name="maintenance_date"
                                    value={form.maintenance_date}
                                    onChange={handleChange}
                                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                                />

                                {errors.maintenance_date && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {errors.maintenance_date[0]}
                                    </p>
                                )}
                            </div>

                            {/* Maintenance Note */}
                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-700">
                                    รายละเอียดการบำรุงรักษา
                                </label>

                                <textarea
                                    name="maintenance_note"
                                    value={form.maintenance_note}
                                    onChange={handleChange}
                                    rows="4"
                                    placeholder="รายละเอียดการซ่อม หรือการบำรุงรักษา..."
                                    className="w-full resize-none rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                                />

                                {errors.maintenance_note && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {errors.maintenance_note[0]}
                                    </p>
                                )}
                            </div>

                            {/* Buttons */}
                            <div className="flex justify-end gap-3 border-t border-slate-200 pt-5">
                                <button
                                    type="button"
                                    onClick={closeForm}
                                    className="rounded-xl border border-slate-300 px-5 py-3 font-semibold text-slate-600 transition hover:bg-slate-50"
                                >
                                    ยกเลิก
                                </button>

                                <button
                                    type="submit"
                                    className="rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white shadow-md transition hover:bg-indigo-700 hover:shadow-lg active:scale-95"
                                >
                                    {editingAsset
                                        ? "💾 บันทึกการแก้ไข"
                                        : "＋ เพิ่มสินทรัพย์"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}