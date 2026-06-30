<?php

function dijkstra($graph, $start, $end)
{
    $dist = [];
    $prev = [];
    $queue = [];

    foreach ($graph as $node => $edges) {
        $dist[$node] = INF;
        $prev[$node] = null;
        $queue[$node] = true;
    }

    $dist[$start] = 0;

    while (!empty($queue)) {

        $minNode = null;

        foreach ($queue as $node => $_) {
            if ($minNode === null || $dist[$node] < $dist[$minNode]) {
                $minNode = $node;
            }
        }

        if ($minNode === $end) {
            break;
        }

        unset($queue[$minNode]);

        foreach ($graph[$minNode] as $neighbor => $weight) {

            $newDistance = $dist[$minNode] + $weight;

            if ($newDistance < $dist[$neighbor]) {
                $dist[$neighbor] = $newDistance;
                $prev[$neighbor] = $minNode;
            }
        }
    }

    $path = [];
    $current = $end;

    while ($current !== null) {
        array_unshift($path, $current);
        $current = $prev[$current];
    }

    return [
        "distance" => $dist[$end],
        "path" => $path
    ];
}

$graph = [
    "A" => ["B" => 4, "C" => 2],
    "B" => ["A" => 4, "C" => 1, "D" => 5],
    "C" => ["A" => 2, "B" => 1, "D" => 8, "E" => 10],
    "D" => ["B" => 5, "C" => 8, "E" => 2],
    "E" => ["C" => 10, "D" => 2]
];

$result = dijkstra($graph, "A", "E");

echo "Distance: " . $result["distance"] . PHP_EOL;
echo "Path: " . implode(" -> ", $result["path"]) . PHP_EOL;

?>