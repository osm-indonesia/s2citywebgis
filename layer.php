<?php
if(@$_GET['simpan'])
{
	 

	if($_POST['urutan']==''||$_POST['nama_katagori']=='')
	{
		header("location: layer.php");
		exit();
	}

	$newarr=array();
	if(file_exists('katagori.json'))
	{
		$newarr=json_decode(file_get_contents('katagori.json'));
	}
	$shp='';
	$urut 	=$_POST['urutan'];
	$nm_kat =$_POST['nama_katagori'];
	$katagori =$_POST['katagori'];
	if(@$_FILES['file_layer']['name'])
	{

		$dir_file 	=$_FILES['file_layer']['tmp_name'];
		$nama_file 	=$_FILES['file_layer']['name']; 
		copy($dir_file, dirname(__FILE__).'\\layer\\'.$nama_file); 
		$shp  	=$_FILES['file_layer']['name'];
 
	}
	elseif(@$_POST['url_layer'])
	{
		$shp=@$_POST['url_layer'];
	}
	if($shp!='')
	{

		array_push($newarr,array($katagori.$urut=>array($urut,$nm_kat,$shp)));
		file_put_contents('katagori.json', json_encode($newarr));
	}
	header("location: layer.php");
}
elseif(@$_GET['hapus'])
{
		$newarr=array();
		if(file_exists('katagori.json'))
		{
				$newarr=json_decode(file_get_contents('katagori.json'));
		}
		$newarr3=array();
		foreach($newarr as $k =>$dt)
				{ 		
						foreach ($dt as $key => $value) 
						{
							if(@$_GET['urutan']!=$key)
							{
								$newarr3[][$key]=$value; 
							}
						}
					
				}
				file_put_contents('katagori.json', json_encode($newarr3));
				header("location: layer.php");

}
elseif(@$_GET['ubah'])
{
	if(@$_POST['urutan'])
	{
		 
			$newarr=array();
			if(file_exists('katagori.json'))
			{
					$newarr=json_decode(file_get_contents('katagori.json'));
			}
			$newarr3=array();
			$o=0;
			$t=0;
 
				foreach($newarr as $k=>$dt)
				{ 
					foreach ($dt as $key => $value)
					{
						$urutan=@$_POST['urutan'][$key];
						$kat_1=substr($key,0,1);
						$newarr3[][$kat_1.$urutan]=array($urutan,$value[1],$value[2]);
					}
				}
				file_put_contents('katagori.json', json_encode($newarr3));


	}
	header("location: layer.php");

}
else
{ 
	$newarr=array();
	if(file_exists('katagori.json'))
	{
		$newarr=json_decode(file_get_contents('katagori.json'));
	}

	$newarr3=array();
	foreach($newarr as $k => $dt)
	{  
		foreach ($dt as $key => $value) {
			$newarr3[$key]=$value;
		}
		
	}
		 

	 
	ksort($newarr3);
	// print_r($newarr3);
	// exit();
	$list_kat='';
	$jml_urt =count($newarr3)+1;
	foreach($newarr3 as $k => $dt)
	{ 

		$kat_1=substr($k,0,1);
		$namakat='';
		switch ($kat_1) {
			case '1':
				$namakat='Admin';
				break;
			case '2':
				$namakat='Infrastruktur';
				break;
			case '3':
				$namakat='Laporan / Temuan Keamanan dan Kenyamanan';
				break;
		}

		$list_kat.='<tr>
					<td>'.$namakat.'</td>
					<td>'.$dt[1].'</td>
					<td><input value="'.$dt[0].'" name="urutan['.@$kat_1.$dt[0].']"></td>
					<td>'.$dt[2].'</td>

					<td><a href="?hapus=ya&kategori='.$dt[1].'&urutan='.@$kat_1.$dt[0].'">hapus</a></td></tr>';
	}
	echo '<!DOCTYPE html>
			<html>
			<head>  
			<meta charset="utf-8">
			<meta name="viewport" content="width=device-width, initial-scale=1">
			<meta name="description" content="">
			<meta name="author" content="Muklis akbar">
   		 	<meta name="generator" content="Hugo 0.111.3">
			<link href="assets/dist/css/bootstrap.min.css" rel="stylesheet">
			<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
			integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
			crossorigin=""/>
			<title>Membuat Layer</title>
			</head>
			<body>
			<style>
				td input {
				width: 50px;
				}
			</style>
			<div class="container">
				<div class="row">
					<div class="col-md-6">
						<form action="?simpan=ya" method="post" enctype="multipart/form-data">
							<div class="form-group">
							<label>katagori</label>
							<select class="form-control" name="katagori">
							<option value="1">Admin</option>
							<option value="2">Infrastruktur</option>
							<option value="3">Laporan / Temuan Keamanan dan Kenyamanan</option>

							</select>
							</div>
							<div class="form-group">
							<label>Nama Layer</label>
							<input class="form-control" name="nama_katagori" type="text" requered>
							</div>
							<div class="form-group">
							<label>urutan</label>
							<input class="form-control" name="urutan"  value="'.$jml_urt.'"  type="number"   requered>
							</div>
							<div class="form-group">
							<label>file</label>
							<input class="form-control" name="file_layer" type="file" >
							<input class="form-control" name="url_layer" type="text" >

							</div>
							<div class="form-group mt-3">
							 <button class="btn btn-success" type="submit">simpan</button>
							</div>
						</form>
					</div>
					<div class="col-md-6">
						<form action="?ubah=ya" method="post">
						<table class="table">
						<tr>
						<td>Katagori</td>
						<td>Nama</td>
						<td>urutan</td>
						<td>layer</td>
						<td>aksi</td>

						</tr>
						'.$list_kat.'
						</table>

						 <button class="btn btn-success" type="submit">simpan</button>
						 </form>
						 <a href="index.html">kembali</a>
						</div>
					</div>
				</div>
			<script src="assets/dist/js/bootstrap.bundle.min.js"></script> 
			</body>
			</html>'; 
	
	
}

?>