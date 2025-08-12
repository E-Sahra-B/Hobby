<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class JsonController extends Controller
{
    public function index(Request $request)
    {
        $path = resource_path('json/data.json');

        if (!file_exists($path)) {
            return response()->json(['error' => 'Data file not found.'], 404);
        }

        $raw = file_get_contents($path);
        $data = json_decode($raw, true);

        if (json_last_error() !== JSON_ERROR_NONE) {
            return response()->json(['error' => 'Invalid JSON.'], 500);
        }

        // JSON farklı şekillerde olabilir; olası array alanlarını kontrol et
        if (isset($data['items']) && is_array($data['items'])) {
            $items = $data['items'];
        } elseif (isset($data['data']) && is_array($data['data'])) {
            $items = $data['data'];
        } elseif (is_array($data)) {
            $items = $data;
        } else {
            $items = [];
        }

        // name alanlarını al, boşları çıkar
        $names = collect($items)->pluck('name')->filter()->values()->all();

        // opsiyonel: ?q=ara parametresiyle kısmi arama
        if ($q = $request->query('q')) {
            $names = array_values(array_filter($names, fn($n) => stripos($n, $q) !== false));
        }

        return response()->json(['names' => $names]);
    }
}
