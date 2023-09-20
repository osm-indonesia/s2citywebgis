<?php 
		 
	$newarr=array();
	if(file_exists('katagori.json'))
	{
		$newarr=json_decode(file_get_contents('katagori.json'));
	}
	$newarr3=array();
	foreach($newarr as $k => $dt)
	{
		foreach ($dt as $key => $value) 
		{
			$newarr3[$key]=$value;
		}
		
		
	}
	ksort($newarr3); 
	$new_arr=array();
	foreach ($newarr3 as $key =>$ky)
	{

		$kat_1=substr($key,0,1);
		$katnm='kategori_1';
		switch ($kat_1) 
		{ 
			case '2':
		$katnm='kategori_2';
			# code...
			break;
			case '3':
		$katnm='kategori_3';
			# code...
			break;
		}
		$new_arr[$katnm][] =array('kategori'=>$kat_1,'urut'=> $ky[0],'nama_layer'=>$ky[1],'layer'=>'layer/'.$ky[2]);
	}
//	sort($new_arr);
	// echo '<pre>';
	// print_r($new_arr);
	// echo '</pre>';
	
	print json_encode($new_arr);

?>