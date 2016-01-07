<?php
$achievements = new stdClass();
$achievements->achievements = array();

$result = json_decode(file_get_contents("http://timfalken.com/hr/internetfornature/history.php?id[]=8&from=0&to=0"));
$totalWeight = 0;
foreach ($result->BinHistories[0]->History as $history) {
    $totalWeight += $history->Weight;
}
$achievement = new stdClass();
$achievement->title = "Verzamel 10 kg Plastic";
$achievement->description = "Jouw plastic wordt verwerkt tot plastic korrels waarvan allerlei nieuwe producten gemaakt kunnen worden!";
$achievement->value = round($totalWeight / 10 * 100);
array_push($achievements->achievements, $achievement);

$achievement = new stdClass();
$achievement->title = "Bemest 3m<sup>2</sup> moestuin";
$achievement->description = "Om deze achievement te behalen moet je 10kg GFT afval hebben verzameld";
$achievement->value = 80;
array_push($achievements->achievements, $achievement);

$achievement = new stdClass();
$achievement->title = "Een paar kaplaarzen";
$achievement->description = "Om deze achievement te behalen met je 10kg plastic hebben verzameld";
$achievement->value = 55;
array_push($achievements->achievements, $achievement);

$achievement = new stdClass();
$achievement->title = "Een tijdschrift";
$achievement->description = "Om deze achievement te behalen moet je 2kg papier hebben verzameld";
$achievement->value = 97;
array_push($achievements->achievements, $achievement);

$achievement = new stdClass();
$achievement->title = "Verzamel 5kg Plastic";
$achievement->description = "Jouw plastic wordt verwerkt tot plastic korrels waarvan allerlei nieuwe producten gemaakt kunnen worden!";
$achievement->value = 100;
array_push($achievements->achievements, $achievement);

$achievement = new stdClass();
$achievement->title = "Een plastic bekertje";
$achievement->description = "Om deze achievement te behalen moet je 700 gram plastic hebben verzameld";
$achievement->value = 100;
array_push($achievements->achievements, $achievement);

$achievement = new stdClass();
$achievement->title = "Een plastic fles";
$achievement->description = "Om deze achievement te behalen moet je 1kg plastic hebben verzameld";
$achievement->value = 100;
array_push($achievements->achievements, $achievement);

print_r(json_encode($achievements));