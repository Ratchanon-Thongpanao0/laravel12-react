import { useMemo, useState } from 'react';
import { Head, router, useForm } from '@inertiajs/react';
import '../../../css/weights.css';

function getCurrentDateTime() {
    const now = new Date();
    const offset = now.getTimezoneOffset() * 60000;

    return new Date(now.getTime() - offset)
        .toISOString()
        .slice(0, 16);
}

function formatDateTime(date) {
    return new Date(date).toLocaleString('th-TH', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

function formatDate(date) {
    return new Date(date).toLocaleDateString('th-TH', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    });
}

function convertToDateTimeLocal(date) {
    const value = new Date(date);
    const offset = value.getTimezoneOffset() * 60000;

    return new Date(value.getTime() - offset)
        .toISOString()
        .slice(0, 16);
}

export default function Index({ weights = [] }) {
    const [editingWeight, setEditingWeight] = useState(null);

    // =========================
    // Add Form
    // =========================

    const addForm = useForm({
        weight: '',
        recorded_at: getCurrentDateTime(),
    });

    // =========================
    // Edit Form
    // =========================

    const editForm = useForm({
        weight: '',
        recorded_at: '',
    });

    // =========================
    // Sort
    // =========================

    const sortedWeights = useMemo(() => {
        return [...weights].sort(
            (a, b) =>
                new Date(a.created_at) -
                new Date(b.created_at)
        );
    }, [weights]);

    // =========================
    // Summary
    // =========================

    const latestWeight =
        sortedWeights.length > 0
            ? Number(
                  sortedWeights[
                      sortedWeights.length - 1
                  ].weight
              )
            : null;

    const firstWeight =
        sortedWeights.length > 0
            ? Number(sortedWeights[0].weight)
            : null;

    const weightChange =
        latestWeight !== null &&
        firstWeight !== null
            ? latestWeight - firstWeight
            : null;

    // =========================
    // Add
    // =========================

    function submitAdd(e) {
        e.preventDefault();

        addForm.post('/weights', {
            preserveScroll: true,

            onSuccess: () => {
                addForm.reset();

                addForm.setData(
                    'recorded_at',
                    getCurrentDateTime()
                );
            },
        });
    }

    // =========================
    // Edit
    // =========================

    function startEdit(item) {
        setEditingWeight(item);

        editForm.setData(
            'weight',
            Number(item.weight).toString()
        );

        editForm.setData(
            'recorded_at',
            convertToDateTimeLocal(
                item.created_at
            )
        );

        editForm.clearErrors();
    }

    function cancelEdit() {
        setEditingWeight(null);

        editForm.reset();

        editForm.clearErrors();
    }

    function submitEdit(e) {
        e.preventDefault();

        if (!editingWeight) {
            return;
        }

        editForm.put(
            `/weights/${editingWeight.id}`,
            {
                preserveScroll: true,

                onSuccess: () => {
                    setEditingWeight(null);
                    editForm.reset();
                },
            }
        );
    }

    // =========================
    // Delete
    // =========================

    function deleteWeight(id) {
        const confirmed = window.confirm(
            'ต้องการลบข้อมูลน้ำหนักนี้หรือไม่?'
        );

        if (!confirmed) {
            return;
        }

        router.delete(`/weights/${id}`, {
            preserveScroll: true,
        });
    }

    // =========================
    // Chart
    // =========================

    const chartWidth = 900;
    const chartHeight = 350;

    const paddingLeft = 55;
    const paddingRight = 30;
    const paddingTop = 35;
    const paddingBottom = 60;

    const graphWidth =
        chartWidth -
        paddingLeft -
        paddingRight;

    const graphHeight =
        chartHeight -
        paddingTop -
        paddingBottom;

    const values = sortedWeights.map((item) =>
        Number(item.weight)
    );

    let minWeight =
        values.length > 0
            ? Math.min(...values)
            : 40;

    let maxWeight =
        values.length > 0
            ? Math.max(...values)
            : 60;

    if (minWeight === maxWeight) {
        minWeight -= 5;
        maxWeight += 5;
    } else {
        const range = maxWeight - minWeight;

        minWeight -= range * 0.15;
        maxWeight += range * 0.15;
    }

    function getX(index) {
        if (sortedWeights.length === 1) {
            return (
                paddingLeft +
                graphWidth / 2
            );
        }

        return (
            paddingLeft +
            (index /
                (sortedWeights.length - 1)) *
                graphWidth
        );
    }

    function getY(weight) {
        return (
            paddingTop +
            ((maxWeight - weight) /
                (maxWeight - minWeight)) *
                graphHeight
        );
    }

    const points = sortedWeights.map(
        (item, index) => ({
            x: getX(index),
            y: getY(Number(item.weight)),
            weight: Number(item.weight),
            date: item.created_at,
        })
    );

    const linePath = points
        .map((point, index) => {
            return `${
                index === 0 ? 'M' : 'L'
            } ${point.x} ${point.y}`;
        })
        .join(' ');

    // =========================
    // Render
    // =========================

    return (
        <>
            <Head title="Weight Tracker" />

            <div className="weight-page">
                <div className="weight-container">

                    {/* Header */}

                    <header className="page-header">
                        <div>
                            <div className="page-label">
                                HEALTH TRACKER
                            </div>

                            <h1>
                                Weight Tracker
                            </h1>

                            <p>
                                บันทึกและติดตามน้ำหนักของคุณ
                            </p>
                        </div>

                        <div className="weight-icon">
                            ⚖️
                        </div>
                    </header>

                    {/* Summary */}

                    <div className="summary-grid">

                        <div className="summary-card">
                            <div className="summary-icon purple">
                                ⚖️
                            </div>

                            <div>
                                <div className="summary-label">
                                    น้ำหนักล่าสุด
                                </div>

                                <div className="summary-number">
                                    {latestWeight !== null
                                        ? latestWeight.toFixed(2)
                                        : '--'}

                                    <span>
                                        kg
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="summary-card">
                            <div className="summary-icon blue">
                                📊
                            </div>

                            <div>
                                <div className="summary-label">
                                    จำนวนครั้งที่บันทึก
                                </div>

                                <div className="summary-number">
                                    {sortedWeights.length}

                                    <span>
                                        ครั้ง
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="summary-card">
                            <div className="summary-icon green">
                                📈
                            </div>

                            <div>
                                <div className="summary-label">
                                    การเปลี่ยนแปลง
                                </div>

                                <div
                                    className={`summary-number ${
                                        weightChange !==
                                            null &&
                                        weightChange > 0
                                            ? 'increase'
                                            : 'decrease'
                                    }`}
                                >
                                    {weightChange !==
                                    null
                                        ? `${
                                              weightChange >
                                              0
                                                  ? '+'
                                                  : ''
                                          }${weightChange.toFixed(
                                              2
                                          )}`
                                        : '--'}

                                    <span>
                                        kg
                                    </span>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Chart */}

                    <section className="content-card">

                        <div className="card-header">
                            <div>
                                <h2>
                                    แนวโน้มน้ำหนัก
                                </h2>

                                <p>
                                    น้ำหนักตามวันที่และเวลา
                                </p>
                            </div>
                        </div>

                        {sortedWeights.length === 0 ? (
                            <div className="empty-state">
                                <div className="empty-icon">
                                    📊
                                </div>

                                <h3>
                                    ยังไม่มีข้อมูล
                                </h3>

                                <p>
                                    เพิ่มน้ำหนักเพื่อเริ่มดูกราฟ
                                </p>
                            </div>
                        ) : (
                            <div className="chart-container">

                                <svg
                                    viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                                    className="weight-chart"
                                >

                                    {/* Grid */}

                                    {[0, 0.25, 0.5, 0.75, 1].map(
                                        (ratio) => {
                                            const y =
                                                paddingTop +
                                                ratio *
                                                    graphHeight;

                                            const value =
                                                maxWeight -
                                                ratio *
                                                    (maxWeight -
                                                        minWeight);

                                            return (
                                                <g
                                                    key={
                                                        ratio
                                                    }
                                                >
                                                    <line
                                                        x1={
                                                            paddingLeft
                                                        }
                                                        x2={
                                                            chartWidth -
                                                            paddingRight
                                                        }
                                                        y1={
                                                            y
                                                        }
                                                        y2={
                                                            y
                                                        }
                                                        className="chart-grid"
                                                    />

                                                    <text
                                                        x="10"
                                                        y={
                                                            y +
                                                            4
                                                        }
                                                        className="chart-label"
                                                    >
                                                        {value.toFixed(
                                                            1
                                                        )}
                                                    </text>
                                                </g>
                                            );
                                        }
                                    )}

                                    {/* Line */}

                                    {points.length > 1 && (
                                        <path
                                            d={
                                                linePath
                                            }
                                            className="chart-line"
                                        />
                                    )}

                                    {/* Points */}

                                    {points.map(
                                        (
                                            point,
                                            index
                                        ) => (
                                            <g
                                                key={
                                                    index
                                                }
                                            >
                                                <circle
                                                    cx={
                                                        point.x
                                                    }
                                                    cy={
                                                        point.y
                                                    }
                                                    r="8"
                                                    className="chart-point"
                                                />

                                                <text
                                                    x={
                                                        point.x
                                                    }
                                                    y={
                                                        point.y -
                                                        17
                                                    }
                                                    textAnchor="middle"
                                                    className="chart-value"
                                                >
                                                    {point.weight.toFixed(
                                                        2
                                                    )}
                                                </text>

                                                <text
                                                    x={
                                                        point.x
                                                    }
                                                    y={
                                                        chartHeight -
                                                        25
                                                    }
                                                    textAnchor="middle"
                                                    className="chart-date"
                                                >
                                                    {formatDate(
                                                        point.date
                                                    )}
                                                </text>
                                            </g>
                                        )
                                    )}

                                </svg>

                            </div>
                        )}

                    </section>

                    {/* Add Weight */}

                    <section className="content-card">

                        <div className="card-header">
                            <div>
                                <h2>
                                    เพิ่มน้ำหนัก
                                </h2>

                                <p>
                                    เลือกวันและเวลาที่ชั่งน้ำหนัก
                                </p>
                            </div>
                        </div>

                        <form
                            className="weight-form"
                            onSubmit={submitAdd}
                        >

                            <div className="input-group">
                                <label>
                                    น้ำหนัก
                                </label>

                                <div className="input-wrapper">

                                    <input
                                        className="weight-input"
                                        type="number"
                                        step="0.01"
                                        min="1"
                                        max="500"
                                        placeholder="เช่น 65.50"
                                        value={
                                            addForm.data
                                                .weight
                                        }
                                        onChange={(e) =>
                                            addForm.setData(
                                                'weight',
                                                e.target
                                                    .value
                                            )
                                        }
                                    />

                                    <span className="input-unit">
                                        kg
                                    </span>

                                </div>
                            </div>

                            <div className="input-group">
                                <label>
                                    วันที่และเวลา
                                </label>

                                <input
                                    className="weight-input"
                                    type="datetime-local"
                                    value={
                                        addForm.data
                                            .recorded_at
                                    }
                                    onChange={(e) =>
                                        addForm.setData(
                                            'recorded_at',
                                            e.target
                                                .value
                                        )
                                    }
                                />
                            </div>

                            <div className="form-button">

                                <button
                                    type="submit"
                                    className="primary-button"
                                    disabled={
                                        addForm.processing
                                    }
                                >
                                    ＋{' '}
                                    {addForm.processing
                                        ? 'กำลังบันทึก...'
                                        : 'เพิ่มน้ำหนัก'}
                                </button>

                            </div>

                        </form>

                        {addForm.errors.weight && (
                            <div className="error-message">
                                {addForm.errors.weight}
                            </div>
                        )}

                        {addForm.errors.recorded_at && (
                            <div className="error-message">
                                {
                                    addForm.errors
                                        .recorded_at
                                }
                            </div>
                        )}

                    </section>

                    {/* History */}

                    <section className="content-card">

                        <div className="card-header">

                            <div>
                                <h2>
                                    ประวัติน้ำหนัก
                                </h2>

                                <p>
                                    ข้อมูลน้ำหนักทั้งหมด
                                </p>
                            </div>

                            <div className="record-count">
                                {sortedWeights.length}{' '}
                                รายการ
                            </div>

                        </div>

                        {sortedWeights.length === 0 ? (
                            <div className="empty-state small">
                                <p>
                                    ยังไม่มีประวัติน้ำหนัก
                                </p>
                            </div>
                        ) : (
                            <div className="table-wrapper">

                                <table className="weight-table">

                                    <thead>
                                        <tr>
                                            <th>
                                                วันที่และเวลา
                                            </th>

                                            <th>
                                                น้ำหนัก
                                            </th>

                                            <th>
                                                จัดการ
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody>

                                        {[...sortedWeights]
                                            .reverse()
                                            .map(
                                                (
                                                    item
                                                ) => (
                                                    <tr
                                                        key={
                                                            item.id
                                                        }
                                                    >

                                                        <td>
                                                            <div className="date-cell">

                                                                <div className="date-icon">
                                                                    📅
                                                                </div>

                                                                <div>
                                                                    <div>
                                                                        {formatDateTime(
                                                                            item.created_at
                                                                        )}
                                                                    </div>
                                                                </div>

                                                            </div>
                                                        </td>

                                                        <td>
                                                            <strong className="table-weight">
                                                                {Number(
                                                                    item.weight
                                                                ).toFixed(
                                                                    2
                                                                )}
                                                            </strong>

                                                            <span className="table-unit">
                                                                kg
                                                            </span>
                                                        </td>

                                                        <td>

                                                            <div className="action-buttons">

                                                                <button
                                                                    type="button"
                                                                    className="edit-button"
                                                                    onClick={() =>
                                                                        startEdit(
                                                                            item
                                                                        )
                                                                    }
                                                                >
                                                                    ✏️
                                                                    แก้ไข
                                                                </button>

                                                                <button
                                                                    type="button"
                                                                    className="delete-button"
                                                                    onClick={() =>
                                                                        deleteWeight(
                                                                            item.id
                                                                        )
                                                                    }
                                                                >
                                                                    🗑️
                                                                    ลบ
                                                                </button>

                                                            </div>

                                                        </td>

                                                    </tr>
                                                )
                                            )}

                                    </tbody>

                                </table>

                            </div>
                        )}

                    </section>

                    {/* Edit */}

                    {editingWeight && (
                        <section className="content-card edit-card">

                            <div className="card-header">
                                <div>
                                    <h2>
                                        แก้ไขข้อมูลน้ำหนัก
                                    </h2>

                                    <p>
                                        แก้ไขน้ำหนัก วัน และเวลา
                                    </p>
                                </div>
                            </div>

                            <form
                                className="weight-form"
                                onSubmit={submitEdit}
                            >

                                <div className="input-group">

                                    <label>
                                        น้ำหนัก
                                    </label>

                                    <div className="input-wrapper">

                                        <input
                                            className="weight-input"
                                            type="number"
                                            step="0.01"
                                            min="1"
                                            max="500"
                                            value={
                                                editForm
                                                    .data
                                                    .weight
                                            }
                                            onChange={(e) =>
                                                editForm.setData(
                                                    'weight',
                                                    e.target
                                                        .value
                                                )
                                            }
                                        />

                                        <span className="input-unit">
                                            kg
                                        </span>

                                    </div>

                                </div>

                                <div className="input-group">

                                    <label>
                                        วันที่และเวลา
                                    </label>

                                    <input
                                        className="weight-input"
                                        type="datetime-local"
                                        value={
                                            editForm
                                                .data
                                                .recorded_at
                                        }
                                        onChange={(e) =>
                                            editForm.setData(
                                                'recorded_at',
                                                e.target
                                                    .value
                                            )
                                        }
                                    />

                                </div>

                                <div className="form-button edit-actions">

                                    <button
                                        type="submit"
                                        className="primary-button"
                                        disabled={
                                            editForm.processing
                                        }
                                    >
                                        {editForm.processing
                                            ? 'กำลังบันทึก...'
                                            : 'บันทึกการแก้ไข'}
                                    </button>

                                    <button
                                        type="button"
                                        className="cancel-button"
                                        onClick={
                                            cancelEdit
                                        }
                                    >
                                        ยกเลิก
                                    </button>

                                </div>

                            </form>

                            {editForm.errors.weight && (
                                <div className="error-message">
                                    {
                                        editForm.errors
                                            .weight
                                    }
                                </div>
                            )}

                            {editForm.errors.recorded_at && (
                                <div className="error-message">
                                    {
                                        editForm.errors
                                            .recorded_at
                                    }
                                </div>
                            )}

                        </section>
                    )}

                    <footer className="page-footer">
                        Weight Tracker • Laravel + React + Inertia
                    </footer>

                </div>
            </div>
        </>
    );
}