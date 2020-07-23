

require([ "esri/request","esri/Map","esri/views/MapView","esri/layers/FeatureLayer","esri/widgets/BasemapGallery", "esri/Graphic", 
"esri/layers/GraphicsLayer","esri/widgets/Locate","esri/widgets/Search"],
function(esriRequest,Map, MapView,FeatureLayer,BasemapGallery,Graphic,GraphicsLayer,Locate,Search){ 
   
    map= new Map({basemap:"satellite"})
    view=new MapView({
     container:"view",
     map:map,zoom:2,center:[1,1]
    });
    view.zoom=10;
    view.center.latitude=33.23821630769768;
    view.center.longitude=35.40497398375633;
    view.ui.remove("zoom");

    var locateWidget = new Locate({
        view: view,   // Attaches the Locate button to the view
        graphic: new Graphic({
          symbol: { type: "simple-marker" ,color:"red"}  // overwrites the default symbol used for the
          // graphic placed at the location of the user when found
        })
      });      
      view.ui.add(locateWidget, "top-left");


    searchWidget = new Search({
        view: view
      });    
      view.ui.add(searchWidget,
        "top-right",
        
      );


    graphicsLayer = new GraphicsLayer();
    map.add(graphicsLayer);

    function addGraphic(event){
        graphicsLayer.removeAll();
        g=new Graphic({
            geometry:event,
            symbol:{
                type: "simple-marker",
                color: "blue",
            },
            // popupTemplate: {
            //     title: "Coordinates",
            //     content: "latitude= "+e.mapPoint.latitude +"<br> longitude="+e.mapPoint.longitude
            //    }
        })
        graphicsLayer.add(g);
    }
    function addGraphic2(a,b){
        graphicsLayer.removeAll();
        g2=new Graphic({
            geometry:{
                type:"point", latitude:b,longitude:a
            },
            symbol:{
                type: "simple-marker",
                color: "red",
            },
            // popupTemplate: {
            //     title: "Coordinates",
            //     content: "latitude= "+e.mapPoint.latitude +"<br> longitude="+e.mapPoint.longitude
            //    }
        })
        graphicsLayer.add(g2);
    }


    view.on("click", function(e){
        $(".x-input").val(e.mapPoint.longitude) ; 
        $(".y-input").val(e.mapPoint.latitude);
        addGraphic(e.mapPoint);
        g.popupTemplate={
            title: "Coordinates",
            content: "latitude= "+e.mapPoint.latitude +"<br> longitude="+e.mapPoint.longitude
           }
        view.goTo( {
            target:e.mapPoint,
            zoom:15
        },{duration:4000}
        );
       
    })
    




      url = "https://sampleserver6.arcgisonline.com/arcgis/rest/services/Utilities/Geometry/GeometryServer/project";

   
    $(".btn").click(function (e) { 
        e.preventDefault();
        inputx= $(".x-input").val();
        inputy= $(".y-input").val();
        
        x=parseFloat(inputx) ;
        y=parseFloat(inputy);
        
        selector=$("option:selected");

        if(selector.val()=="wgs to stereo"){
           
            view.goTo( {
                target:[x,y],
                zoom:15
            },{duration:4000}
            );
           addGraphic2(x,y) 
           
        options = {
            responseType: "json", 
                query: {
                    f: "json",
                    inSR: 4326,
                    outSR: 22700,
                    geometries: JSON.stringify({
                            "geometryType" : "esriGeometryPoint",
                            "geometries" : [
                            {"x" :x, "y" : y},
                            
                            ]
                            }),
                    transformation: JSON.stringify({
                        "wkt": "GEOGTRAN[\"WGS_1984_(ITRF00)_To_Deir_ez_Zor_Levant_Zone\",GEOGCS[\"GCS_WGS_1984\",DATUM[\"D_WGS_1984\",SPHEROID[\"WGS_1984\",6378137.0,298.257223563]],PRIMEM[\"Greenwich\",0.0],UNIT[\"Degree\",0.0174532925199433]],GEOGCS[\"GCS_Deir_ez_Zor\",DATUM[\"D_Deir_ez_Zor\",SPHEROID[\"Clarke_1880_IGN\",6378249.2,293.4660212936265]],PRIMEM[\"Greenwich\",0.0],UNIT[\"Degree\",0.0174532925199433]],METHOD[\"Coordinate_Frame\"],PARAMETER[\"X_Axis_Translation\",175.993534],PARAMETER[\"Y_Axis_Translation\",125.164623],PARAMETER[\"Z_Axis_Translation\",-244.865805],PARAMETER[\"X_Axis_Rotation\",-17.315446],PARAMETER[\"Y_Axis_Rotation\",-12.135795],PARAMETER[\"Z_Axis_Rotation\",-10.542653],PARAMETER[\"Scale_Difference\",-6.123214]]"
                        }),
                    transformForward:"true"
                                        }
                                    };
        esriRequest(url, options)
        .then (function(response){
            a=JSON.stringify(response.data);
            result=JSON.parse(a)
    
            $(".output-x").text(result.geometries[0].x);
            $(".output-y").text(result.geometries[0].y);
            $(".output-box").slideDown()
           
        })}else if(selector.val()=="stereo to wgs") {

           

            options2 = {
                responseType: "json", 
                    query: {
                        f: "json",
                        inSR: 22700,
                        outSR: 4326,
                        geometries: JSON.stringify({
                                "geometryType" : "esriGeometryPoint",
                                "geometries" : [
                                {"x" :x, "y" : y},
                                
                                ]
                                }),
                        transformation: JSON.stringify({"wkt":"GEOGTRAN[\"_Deir_ez_Zor_Levant_Zone_To_WGS_1984_(ITRF00)\",GEOGCS[\"GCS_Deir_ez_Zor\",DATUM[\"D_Deir_ez_Zor\",SPHEROID[\"Clarke_1880_IGN\",6378249.2,293.4660212936265]],PRIMEM[\"Greenwich\",0.0],UNIT[\"Degree\",0.0174532925199433]],GEOGCS[\"GCS_WGS_1984\",DATUM[\"D_WGS_1984\",SPHEROID[\"WGS_1984\",6378137.0,298.257223563]],PRIMEM[\"Greenwich\",0.0],UNIT[\"Degree\",0.0174532925199433]],METHOD[\"Coordinate_Frame\"],PARAMETER[\"X_Axis_Translation\",-175.993534],PARAMETER[\"Y_Axis_Translation\",-125.164623],PARAMETER[\"Z_Axis_Translation\",244.865805],PARAMETER[\"X_Axis_Rotation\",17.315446],PARAMETER[\"Y_Axis_Rotation\",12.135795],PARAMETER[\"Z_Axis_Rotation\",10.542653],PARAMETER[\"Scale_Difference\",6.123214]]"}),transformForward:"true"
                                            }
                                        };
            esriRequest(url, options2)
            .then (function(response){
                a=JSON.stringify(response.data);
                result=JSON.parse(a)
                let a2=  $(".output-x");let b2= $(".output-y");
               a2.text(result.geometries[0].x);
               b2.text(result.geometries[0].y);
               $(".output-box").slideDown();

               let x2= parseFloat(a2.text());
               let y2=parseFloat(b2.text())
                view.goTo( {
                    target:[x2,y2],
                    zoom:15
                },{duration:4000}
                );
               addGraphic2(x2,y2) 

            
               
            })

        }else if(selector.val()=="stereo to utm"){
            options = {
                responseType: "json", 
                    query: {
                        f: "json",
                        inSR: 22700,
                        outSR: 32636,
                        geometries: JSON.stringify({
                                "geometryType" : "esriGeometryPoint",
                                "geometries" : [
                                {"x" :x, "y" : y},
                                
                                ]
                                }),
                        transformation: JSON.stringify(
                            {"wkt":"GEOGTRAN[\"_Deir_ez_Zor_Levant_Zone_To_WGS_1984_UTM_Zone_36N\",GEOGCS[\"GCS_Deir_ez_Zor\",DATUM[\"D_Deir_ez_Zor\",SPHEROID[\"Clarke_1880_IGN\",6378249.2,293.4660212936265]],PRIMEM[\"Greenwich\",0.0],UNIT[\"Degree\",0.0174532925199433]],GEOGCS[\"GCS_WGS_1984\",DATUM[\"D_WGS_1984\",SPHEROID[\"WGS_1984\",6378137.0,298.257223563]],PRIMEM[\"Greenwich\",0.0],UNIT[\"Degree\",0.0174532925199433]],METHOD[\"Coordinate_Frame\"],PARAMETER[\"X_Axis_Translation\",-175.993534],PARAMETER[\"Y_Axis_Translation\",-125.164623],PARAMETER[\"Z_Axis_Translation\",244.865805],PARAMETER[\"X_Axis_Rotation\",17.315446],PARAMETER[\"Y_Axis_Rotation\",12.135795],PARAMETER[\"Z_Axis_Rotation\",10.542653],PARAMETER[\"Scale_Difference\",6.123214]]"}
                        ),
                        transformForward:"true"
                                            }
                                        };
            esriRequest(url, options)
            .then (function(response){
                a=JSON.stringify(response.data);
                result=JSON.parse(a)
        
                $(".output-x").text(result.geometries[0].x);
                $(".output-y").text(result.geometries[0].y);
                $(".output-box").slideDown()
               
         })}else if(selector.val()=="utm to stereo"){
            options = {
                responseType: "json", 
                    query: {
                        f: "json",
                        inSR: 32636,
                        outSR: 22700,
                        geometries: JSON.stringify({
                                "geometryType" : "esriGeometryPoint",
                                "geometries" : [
                                {"x" :x, "y" : y},
                                
                                ]
                                }),
                        transformation: JSON.stringify(
                            {"wkt":"GEOGTRAN[\"WGS_1984_UTM_Zone_36N_To_Deir_ez_Zor_Levant_Zone\",GEOGCS[\"GCS_WGS_1984\",DATUM[\"D_WGS_1984\",SPHEROID[\"WGS_1984\",6378137.0,298.257223563]],PRIMEM[\"Greenwich\",0.0],UNIT[\"Degree\",0.0174532925199433]],GEOGCS[\"GCS_Deir_ez_Zor\",DATUM[\"D_Deir_ez_Zor\",SPHEROID[\"Clarke_1880_IGN\",6378249.2,293.4660212936265]],PRIMEM[\"Greenwich\",0.0],UNIT[\"Degree\",0.0174532925199433]],METHOD[\"Coordinate_Frame\"],PARAMETER[\"X_Axis_Translation\",175.993534],PARAMETER[\"Y_Axis_Translation\",125.164623],PARAMETER[\"Z_Axis_Translation\",-244.865805],PARAMETER[\"X_Axis_Rotation\",-17.315446],PARAMETER[\"Y_Axis_Rotation\",-12.135795],PARAMETER[\"Z_Axis_Rotation\",-10.542653],PARAMETER[\"Scale_Difference\",-6.123214]]"}
                        ),
                        transformForward:"true"
                                            }
                                        };
            esriRequest(url, options)
            .then (function(response){
                a=JSON.stringify(response.data);
                result=JSON.parse(a)
        
                $(".output-x").text(result.geometries[0].x);
                $(".output-y").text(result.geometries[0].y);
                $(".output-box").slideDown()
               
            })} else if(selector.val()=="stereo to utm"){
                options = {
                    responseType: "json", 
                        query: {
                            f: "json",
                            inSR: 22700,
                            outSR: 32636,
                            geometries: JSON.stringify({
                                    "geometryType" : "esriGeometryPoint",
                                    "geometries" : [
                                    {"x" :x, "y" : y},
                                    
                                    ]
                                    }),
                            transformation: JSON.stringify(
                                {"wkt":"GEOGTRAN[\"_Deir_ez_Zor_Levant_Zone_To_WGS_1984_UTM_Zone_36N\",GEOGCS[\"GCS_Deir_ez_Zor\",DATUM[\"D_Deir_ez_Zor\",SPHEROID[\"Clarke_1880_IGN\",6378249.2,293.4660212936265]],PRIMEM[\"Greenwich\",0.0],UNIT[\"Degree\",0.0174532925199433]],GEOGCS[\"GCS_WGS_1984\",DATUM[\"D_WGS_1984\",SPHEROID[\"WGS_1984\",6378137.0,298.257223563]],PRIMEM[\"Greenwich\",0.0],UNIT[\"Degree\",0.0174532925199433]],METHOD[\"Coordinate_Frame\"],PARAMETER[\"X_Axis_Translation\",-175.993534],PARAMETER[\"Y_Axis_Translation\",-125.164623],PARAMETER[\"Z_Axis_Translation\",244.865805],PARAMETER[\"X_Axis_Rotation\",17.315446],PARAMETER[\"Y_Axis_Rotation\",12.135795],PARAMETER[\"Z_Axis_Rotation\",10.542653],PARAMETER[\"Scale_Difference\",6.123214]]"}
                            ),
                            transformForward:"true"
                                                }
                                            };
                esriRequest(url, options)
                .then (function(response){
                    a=JSON.stringify(response.data);
                    result=JSON.parse(a)
            
                    $(".output-x").text(result.geometries[0].x);
                    $(".output-y").text(result.geometries[0].y);
                    $(".output-box").slideDown()
                   
             })}else if(selector.val()=="utm to wgs"){
                options = {
                    responseType: "json", 
                        query: {
                            f: "json",
                            inSR: 32636,
                            outSR: 4326,
                            geometries: JSON.stringify({
                                    "geometryType" : "esriGeometryPoint",
                                    "geometries" : [
                                    {"x" :x, "y" : y},
                                    
                                    ]
                                    }),
                           
                            transformForward:"true"
                                                }
                                            };
                esriRequest(url, options)
                .then (function(response){
                    a=JSON.stringify(response.data);
                    result=JSON.parse(a)
                    let a2=  $(".output-x");let b2= $(".output-y");
                    a2.text(result.geometries[0].x);
                    b2.text(result.geometries[0].y);
                    $(".output-box").slideDown();
     
                    let x2= parseFloat(a2.text());
                    let y2=parseFloat(b2.text())
                     view.goTo( {
                         target:[x2,y2],
                         zoom:15
                     },{duration:4000}
                     );
                    addGraphic2(x2,y2) 
                })}else if(selector.val()=="wgs to utm"){
                    view.goTo( {
                        target:[x,y],
                        zoom:15
                    },{duration:4000}
                    );
                   addGraphic2(x,y) 


                    options = {
                        responseType: "json", 
                            query: {
                                f: "json",
                                inSR: 4326,
                                outSR: 32636,
                                geometries: JSON.stringify({
                                        "geometryType" : "esriGeometryPoint",
                                        "geometries" : [
                                        {"x" :x, "y" : y},
                                        
                                        ]
                                        }),
                               
                                transformForward:"true"
                                                    }
                                                };
                    esriRequest(url, options)
                    .then (function(response){
                        a=JSON.stringify(response.data);
                        result=JSON.parse(a)
                
                        $(".output-x").text(result.geometries[0].x);
                        $(".output-y").text(result.geometries[0].y);
                        $(".output-box").slideDown()
                       
                    })}
    });
       
  
  



})