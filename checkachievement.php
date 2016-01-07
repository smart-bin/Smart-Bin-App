<?php
$result = json_decode(file_get_contents("http://timfalken.com/hr/internetfornature/history.php?id[]=8&from=0&to=0"));
$totalWeight = 0;
foreach ($result->BinHistories[0]->History as $history) {
    $totalWeight += $history->Weight;
}
return $totalWeight > 10;