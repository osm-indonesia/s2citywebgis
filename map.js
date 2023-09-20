$(document).ready(function()
	{ 

		var height_=parseInt($(window).height())+15; 
		$('#map').css('height',`${height_}px`);
		var map = L.map('map').setView([-6.967, 107.547], 10);

	window.terrain=	L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
		maxZoom: 19,
		//attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
		}).addTo(map);

var Satellite,Road;
		$('#Menu').click(function(e)
		{
			e.preventDefault();
			$(this).closest('.btn-menu').toggleClass('show');
		});

		$('#Tentang').click(function(e)
		{
			e.preventDefault();
			$('#ModalTentang').modal('show');
		});
		
		getlistlayer();	
		function getlistlayer()
		{
			const Form_item  = new FormData();  
			fetch('APi_layer.php', { method: 'POST',body:Form_item}).then(res => res.json()).then(data => 
			    {
			    	
			    	var list_layer=``; 
			    	for(let l in data)
			    	{ 
			    		var katagor='';
			    		switch(l)
			    		{
			    			case 'kategori_1':
			    			katagor='Admin';
			    			break;
			    			case 'kategori_2':
			    			katagor='Infrastruktur';
			    			break;
			    			case 'kategori_3':
			    			katagor='Laporan / Temuan Keamanan dan Kenyamanan';
			    			break;
			    		}
			    		list_layer +=`<li><table class="sub-layer"><tr><td colspan="2"><h4>${katagor}</h4></td></tr>`;
			    		var o=1;
			    		for(let m of data[l])
			    		{
			    			var tb_kanan=``;
			    			var tb_kiri=``;

			    			if(o %2!= 0)
			    			{
			    			 	tb_kanan=`<tr><td><input name="layer[]" type="checkbox" value="${m.layer}" > ${m.nama_layer}</td>`;
			    			}
			    			else
			    			{
								tb_kiri=`<td><input name="layer[]" type="checkbox" value="${m.layer}" > ${m.nama_layer}</td></tr>` ;

			    			}
			    			list_layer+=`${tb_kiri}${tb_kanan}`;
			    			 o++;
			    		}
			    		list_layer +=`</table></li>`; 

			    	} 
			    	$('.base_layer').html(list_layer);
			    });  
		}

	$('body').delegate('input[name="layer[]"]','change',function(e){
		e.preventDefault(); 
		show_layer($(this));

	});
		
		function show_layer(this_)
		{

					var val_layer=this_.val();
				if(this_.is(':checked')!=true)
				{
					val_layer=val_layer.replace('layer/','');
					var el_layer=val_layer.replace(':','');
					el_layer=el_layer.replace(' ',''); 
					$(`.${el_layer}`).remove();
					if(window[`layer_${val_layer}`])
					{

						map.removeLayer(window[`layer_${val_layer}`]);
					}
					if(window[`layer_wms_${val_layer}`])
					{
						map.removeLayer(window[`layer_wms_${val_layer}`]);
					}
				}
				else
				{

					if(val_layer.indexOf('.geojson')==-1)
					{

						val_layer=val_layer.replace('layer/','');
						var wmsLayer = L.Geoserver.wms("https://datapoi.my.id/geoserver/wms", {
						layers: `${val_layer}`,
						});
						wmsLayer.addTo(map); 
						window[`layer_wms_${val_layer}`]=wmsLayer;
						
						// //legenda
						// var legend = L.Geoserver.legend("https://riskinfo.tj/geoserver/wms", {
						// layers: `${val_layer}`,
						// });
						// legend.addTo(map);
						
						var url_legenda=`https://datapoi.my.id/geoserver/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=${val_layer}`;
						var el_layer=val_layer.replace(':',''); 
						el_layer=el_layer.replace(' ',''); 

						$('#legenda').append(`<li class="${el_layer}"><img src="${url_legenda}"></li>`);
						
						//legenda
					}
					else
					{ 
						fetch(`${val_layer}`, { method: 'GET'}).then(res => res.json()).then(data => 
						{ 
								var layer_=L.geoJSON(data, 
								{
									
									onEachFeature: function (feature, layer) {

									var lest_=``;
										for(let t in feature.properties)
										{
											lest_+=`<tr><td>${t}</td><td>${feature.properties[t]}</td></tr>`;
											 
										}
										var list_=`<div class="table-responsive"><table class="table"> 
													${lest_} 
													</table></div>`;
									layer.bindPopup(list_);
									}
								},
								).addTo(map);
								window[`layer_${val_layer}`]=layer_;
						});  

					}
				}
			
		}

		$('body').delegate('#ShowSidebar','click',function(e)
		{
			e.preventDefault();
			$('.side-bar-right').addClass('show');
		});
		$('body').delegate('#HideSidebar','click',function(e)
		{
			e.preventDefault();
			$('.side-bar-right').removeClass('show');
		});
		$('body').delegate('input[name="satelite"]','change',function(e)
		{

			e.preventDefault();
			if(terrain!=undefined)
			{ 
				map.removeLayer(window.terrain);
			}
			if(window.Satellite!=undefined)
			{
				map.removeLayer(window.Satellite); 
			}
			if(window.Road!=undefined)
			{
				map.removeLayer(window.Road); 
			}

			console.log($(this).val());

			mapboxgl.accessToken = 'pk.eyJ1IjoibXVraGxpc3BvaSIsImEiOiJjbGtjODM2b2IwanlmM2xycDNtMjU1M201In0.k-NMrlsKxzbTjMhEUq72ew'
			
				if($(this).val()=='Terrain')
				{
					window.terrain=	L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
					maxZoom: 19,
					attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://www.openstreetmap.or.id/">Perkumpulan</a>'
					}).addTo(map);
				}
				if($(this).val()=='Satellite')
				{
				window.Satellite=L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/satellite-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoibXVraGxpc3BvaSIsImEiOiJjbGtjODM2b2IwanlmM2xycDNtMjU1M201In0.k-NMrlsKxzbTjMhEUq72ew',{
				maxZoom: 20,
				attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://www.mapbox.com/">MapBox</a>'
				}).addTo(map);
				}
				if($(this).val()=='Road')
				{
				window.Road=	L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/streets-v10/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoibXVraGxpc3BvaSIsImEiOiJjbGtjODM2b2IwanlmM2xycDNtMjU1M201In0.k-NMrlsKxzbTjMhEUq72ew", {
				maxZoom: 19,
				attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://www.mapbox.com/">MapBox</a>'
				}).addTo(map);
				}
			
		});
 map.addEventListener('click', onMapClick);
    popup = new L.Popup({maxWidth: 1000});
    function onMapClick(e) {
	if(this._layers==undefined)
	{
		return
	}
    var latlngStr 	= '(' + e.latlng.lat.toFixed(3) + ', ' +e.latlng.lng.toFixed(3) + ')';
    var BBOX 	 	=  map.getBounds()._southWest.lng+","+map.getBounds()._southWest.lat+","+map.getBounds()._northEast.lng+","+map.getBounds()._northEast.lat;
    var WIDTH 		=  map.getSize().x;
    var HEIGHT 		= map.getSize().y;
    var X 			= map.layerPointToContainerPoint(e.layerPoint).x;
    var Y 			= map.layerPointToContainerPoint(e.layerPoint).y;
	var _layers = this._layers,
	layers  		= [],
	versions  		= [],
	styles  		= [];

	for (var x in _layers) {
		var _layer = _layers[x];
		if (_layer.wmsParams) 
		{
			layers.push(_layer.wmsParams.layers);
			versions.push(_layer.wmsParams.version);
			styles.push(_layer.wmsParams.styles);
		}
	}
// mendapatkan data popup
	var URL  		= `https://datapoi.my.id/geoserver/wms?SERVICE=WMS&VERSION=1.1.1&REQUEST=GetFeatureInfo&FORMAT=application/json&TRANSPARENT=true&QUERY_LAYERS=${layers.join(',')}&STYLES&LAYERS=${layers.join(',')}&exceptions=application/vnd.ogc.se_inimage&INFO_FORMAT=application/json&FEATURE_COUNT=50&X=${X}&Y=${Y}&WIDTH=${WIDTH}&HEIGHT=${HEIGHT}&BBOX=${BBOX}`;
	fetch(URL).then(res => res.json()).then(data => 
	{
		if(data.features[0]!=undefined)
		{ 
			var longlat=[e.latlng.lat.toFixed(3),e.latlng.lng.toFixed(3)];
			var dt_pp=data.features[0].properties;
			var dt_pp_nme=Object.keys(dt_pp);
			var tb=``;
			for(let dt_ of  dt_pp_nme)
			{
			tb+=`<tr><td>${dt_}</td><td>${dt_pp[dt_]}</td></tr>`;
			}
			tb=`<table class="table">${tb}</table>`;
			showPopup(longlat, tb);
		}
	});  
// mendapatkan data popup 


  }   
function showPopup(latlng, element) {
  if (popup) 
  {
    popup.setLatLng(latlng)
      .setContent(element)
      .openOn(map);
  } 
  else 
  {
    popup = L.popup({
        maxWidth: 1000
      })
      .setLatLng(latlng)
      .setContent(element)
      .openOn(map);
  }
}

	});

