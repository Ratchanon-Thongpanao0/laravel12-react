import { useEffect, useState } from "react";

export default function AssetView() {
    const [assets, setAssets] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/assets")
            .then((response) => response.json())
            .then((data) => {
                setAssets(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error:", error);
                setLoading(false);
            });
    }, []);

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

    const getMaintenanceStatus = (date) => {
        if (!date) {
            return {
                text: "ไม่ได้กำหนด",
                className: "bg-gray-100 text-gray-600",
            };
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const maintenanceDate = new Date(`${date.substring(0, 10)}T00:00:00`);
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

    const maintenanceAlerts = assets.filter((asset) => {
        if (!asset.maintenance_date) {
            return false;
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const maintenanceDate = new Date(
            `${asset.maintenance_date.substring(0, 10)}T00:00:00`
        );

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

                    <div className="flex items-center gap-4">

                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-2xl">
                            👀
                        </div>

                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">
                                Asset Management
                            </h1>

                            <p className="mt-1 text-slate-300">
                                ระบบดูข้อมูลสินทรัพย์องค์กร
                            </p>
                        </div>

                    </div>

                </div>
            </header>

            {/* Main */}
            <main className="mx-auto max-w-7xl px-6 py-8">

                {/* Summary */}
                <div className="mb-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

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
                                    (asset) =>
                                        asset.status === "ใช้งาน"
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
                                    (asset) =>
                                        asset.status === "ซ่อม"
                                ).length
                            }
                        </p>
                    </div>

                </div>

                {/* Maintenance Alert */}
                {maintenanceAlerts.length > 0 && (
                    <div className="mb-8 rounded-2xl border border-amber-200 bg-amber-50 p-5">

                        <div className="flex items-start gap-3">

                            <div className="text-2xl">
                                🔔
                            </div>

                            <div>

                                <h3 className="font-bold text-amber-800">
                                    แจ้งเตือนการบำรุงรักษา
                                </h3>

                                <p className="mt-1 text-sm text-amber-700">
                                    มีสินทรัพย์ที่ถึงกำหนดหรือใกล้ถึงกำหนดบำรุงรักษา
                                </p>

                            </div>

                        </div>

                        <div className="mt-4 space-y-2">

                            {maintenanceAlerts.map((asset) => (

                                <div
                                    key={asset.id}
                                    className="rounded-xl bg-white px-4 py-3"
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
                                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
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
                )}

                {/* Asset Table */}
                <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">

                    <div className="border-b border-slate-200 px-6 py-5">

                        <h2 className="text-xl font-bold text-slate-800">
                            รายการสินทรัพย์
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            ผู้ใช้งานทั่วไปสามารถดูข้อมูลได้อย่างเดียว
                        </p>

                    </div>

                    {loading ? (

                        <div className="p-12 text-center text-slate-500">
                            กำลังโหลดข้อมูล...
                        </div>

                    ) : assets.length === 0 ? (

                        <div className="p-12 text-center text-slate-500">
                            ยังไม่มีสินทรัพย์
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

                                    </tr>

                                </thead>

                                <tbody className="divide-y divide-slate-100">

                                    {assets.map((asset) => (

                                        <tr
                                            key={asset.id}
                                            className="transition hover:bg-slate-50"
                                        >

                                            <td className="px-6 py-5">

                                                <span className="rounded-lg bg-indigo-50 px-3 py-1.5 font-mono text-sm font-semibold text-indigo-700">
                                                    {asset.asset_code}
                                                </span>

                                            </td>

                                            <td className="px-6 py-5">

                                                <div className="font-semibold text-slate-800">
                                                    {asset.name}
                                                </div>

                                            </td>

                                            <td className="px-6 py-5 text-slate-600">
                                                {asset.type || "-"}
                                            </td>

                                            <td className="px-6 py-5 text-slate-600">
                                                {asset.assigned_to ||
                                                    "ยังไม่ได้มอบหมาย"}
                                            </td>

                                            <td className="px-6 py-5">

                                                <span
                                                    className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(
                                                        asset.status
                                                    )}`}
                                                >
                                                    {asset.status}
                                                </span>

                                            </td>

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

                                                    </div>

                                                ) : (

                                                    <span className="text-sm text-slate-400">
                                                        ไม่ได้กำหนด
                                                    </span>

                                                )}

                                            </td>

                                        </tr>

                                    ))}

                                </tbody>

                            </table>

                        </div>

                    )}

                </div>

            </main>

        </div>
    );
}