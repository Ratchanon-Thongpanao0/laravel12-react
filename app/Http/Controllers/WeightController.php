<?php

namespace App\Http\Controllers;

use App\Models\Weight;
use Illuminate\Http\Request;

class WeightController extends Controller
{
    public function index()
    {
        $weights = Weight::orderBy('created_at', 'asc')->get();

        return inertia('Weights/Index', [
            'weights' => $weights,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'weight' => 'required|numeric|min:1|max:500',
            'recorded_at' => 'required|date',
        ]);

        Weight::create([
            'weight' => $validated['weight'],
            'created_at' => $validated['recorded_at'],
            'updated_at' => $validated['recorded_at'],
        ]);

        return redirect()->route('weights.index');
    }

    public function update(Request $request, Weight $weight)
    {
        $validated = $request->validate([
            'weight' => 'required|numeric|min:1|max:500',
            'recorded_at' => 'required|date',
        ]);

        $weight->weight = $validated['weight'];
        $weight->created_at = $validated['recorded_at'];
        $weight->save();

        return redirect()->route('weights.index');
    }

    public function destroy(Weight $weight)
    {
        $weight->delete();

        return redirect()->route('weights.index');
    }
}