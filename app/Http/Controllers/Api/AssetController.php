<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Asset;
use Illuminate\Http\Request;

class AssetController extends Controller
{
    // แสดงสินทรัพย์ทั้งหมด
    public function index()
    {
        return response()->json(Asset::orderBy('maintenance_date')->get());
    }

    // เพิ่มสินทรัพย์
    public function store(Request $request)
    {
        $validated = $request->validate([
            'asset_code' => 'required|string|max:50|unique:assets,asset_code',
            'name' => 'required|string|max:255',
            'type' => 'required|string|max:100',
            'assigned_to' => 'nullable|string|max:255',
            'status' => 'required|string|max:50',
            'maintenance_date' => 'nullable|date',
            'maintenance_note' => 'nullable|string',
        ]);

        $asset = Asset::create($validated);

        return response()->json($asset, 201);
    }

    // แสดงสินทรัพย์รายการเดียว
    public function show(Asset $asset)
    {
        return response()->json($asset);
    }

    // แก้ไขสินทรัพย์
    public function update(Request $request, Asset $asset)
    {
        $validated = $request->validate([
            'asset_code' => 'required|string|max:50|unique:assets,asset_code,' . $asset->id,
            'name' => 'required|string|max:255',
            'type' => 'required|string|max:100',
            'assigned_to' => 'nullable|string|max:255',
            'status' => 'required|string|max:50',
            'maintenance_date' => 'nullable|date',
            'maintenance_note' => 'nullable|string',
        ]);

        $asset->update($validated);

        return response()->json($asset);
    }

    // ลบสินทรัพย์
    public function destroy(Asset $asset)
    {
        $asset->delete();

        return response()->json([
            'message' => 'Asset deleted successfully'
        ]);
    }
}