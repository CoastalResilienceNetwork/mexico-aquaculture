import { createStore } from 'vuex';
import esriRequest from '@arcgis/core/request';

export default createStore({
  state: {
    data: {
      // data retrieved from web services
      supportingLayers: '', //used to create the supportinglayer tree
      slReady: false,
    },
    config: {
      // config info
      supportingMapLayers: [
        {
          mapService:
            'https://services2.coastalresilience.org/arcgis/rest/services/Mexico/AquacultureSuitability/MapServer',
          skipLayers: [0, 1],
          title: '',
          popupTemplate: [
            {
              title: 'Watershed Boundary',
              field: 'NAME',
              label: 'Watershed Name',
              id: '',
            },
            {
              title: 'Town Boundary',
              field: 'TOWN',
              label: 'Town Name',
              id: '',
            },
          ],
        },
      ],
      supportingLayersTitle: '',
      supportingLayersOnMap: true,
      supportingLayersInPanel: true,
      panelDisplayType: 'tabsHorizontal', //plain, tabsHorizontal, tabsVertical
      languageEnglish: {
        header: {
          title: 'Aquaculture Site Suitability',
          subtitle: 'Baja Peninsula - Mexico',
        },
        tabs: {
          allLayers: 'All Layers',
          createSite: 'Create Site',
        },
        supportingLayers: {
          title: 'Supporting Layers',
          description:
            'Use the search to filter layers or expand the contents to browse',
          filterDescription: 'Begin typing to filter layers',
          layersTitle: 'Mexico Aquaculture Study',
          clearLayers: 'Clear Layers',
        },
        createSite: {
          title: 'Create Site',
          description:
            'Draw a rectangle on the map representing the aquaculture site boundary. Retrieve site specific statistics and suitability parameters.',
          drawTitle: 'Draw site bounding box',
          drawDescription:
            'Zoom and pan the map to find your site location. Then click the Draw button to start drawing. Click and drag the mouse to draw a box around the site.',
          select: 'Select species type',
          clearLayers: 'Clear Layers',
          drawButton: 'Draw',
          reviewStatistics: 'Review Site Statistics',
          reviewParameters: 'Review site suitability parameters',
          siteParameters: 'Site suitability parameters',
          createSiteDescription:
            'Click Create Site to generate a printable report and a custom URL',
          createButton: 'Create Site',
          reset: 'Reset',
          siteCreated: 'Site Created',
          siteCreatedDescription:
            'Print a PDF report of the site results and map. Retrieve a custom URL to save or share your site boundary.',
          createReport: 'Create Report',
          createReportDescription:
            'Create a printable PDF report of your site area and parameters',
          createReportButton: 'Generate Report',
          copyURL: 'Copy custom URL',
          copyURLNote:
            'Note: Your site information is embedded in the URL. This site can only be viewed or shared with the custom link provided below.',
          copyURLButton: 'Copy URL',
          createNew: 'Create New Site',
          createNewNote:
            'Note: Creating a new site will delete this entry. Make sure you copy your URL and save it to view this site at a later time.',
        },
        siteStatistics: {
          overallSuitabilityOffshore: 'Overall Suitability (offshore)',
          overallSuitabilityOnshore: ' / Overall Suitability (nearshore)',
          avgScore: 'Avg Score',
          area: 'Area',
          siteCorners: 'Site Corners',
          dd: 'decimal degrees',
        },
        report: {
          title: 'Aquaculture Site Suitability. Baja Peninsula - Mexico',
          statistics: 'Site Statistics',
          parameters: 'Site Parameters',
          siteMap: 'Site Map',
        },
      },
      languageSpanish: {
        header: {
          title: 'Análisis de idoneidad del sitio para acuicultura',
          subtitle: 'Península de Baja California - México',
        },
        tabs: {
          allLayers: 'Todas las capas',
          createSite: 'Crear sitio',
        },
        supportingLayers: {
          title: 'Capas de soporte',
          description:
            'Utilice la búsqueda para filtrar capas y navegar entre la información',
          filterDescription: 'Comience a escribir para filtrar las capas',
          layersTitle: 'Estudio de Acuicultura en México',
          clearLayers: 'Limpiar capas',
        },
        createSite: {
          title: 'Crear sitio',
          description:
            'Dibujar un rectángulo en el mapa que represente el límite del sitio de acuicultura. Consulte estadísticas específicas del sitio y parámetros de idoneidad.',
          drawTitle: 'Dibuja una caja con límites del sitio',
          drawDescription:
            'Deslice y acérquese al mapa para encontrar la ubicación de su sitio. Luego, haga click en el botón de Dibujar para comenzar a trazar el área. Haga click mientras arrastra el mouse para dibujar una caja alrededor del sitio.',
          clearLayers: 'Limpiar capas',
          select: 'Seleccionar tipo de especie',
          drawButton: 'Dibuja',
          reviewStatistics: 'Revisar las características del sitio:',
          siteStatistics: 'Estadísticas del sitio',
          reviewParameters: 'Revisar los parámetros de idoneidad del sitio',
          siteParameters: 'Parámetros de idoneidad del sitio',
          createSiteDescription:
            'Haga clic en Crear sitio para generar un informe en PDF con opción a imprimir y un enlace personalizado.',
          createButton: 'Crear sitio',
          reset: 'Reiniciar',
          siteCreated: 'Sitio creado',
          siteCreatedDescription:
            'Imprima un reporte PDF de los resultados del sitio y mapa. Genere una URL personalizable para guardar o compartir los límites de su sitio.',
          createReport: 'Crear un Reporte',
          createReportDescription:
            'Crea un reporte PDF imprimible del área de tu sitio y parámetros',
          createReportButton: 'Generar Reporte',
          copyURL: 'Copia URL personalizado',
          copyURLNote:
            'Nota: La información de su sitio está incorporada en la URL. Este sitio sólo puede ser visto o compartido con el enlance personalizado de abajo',
          copyURLButton: 'Copiar URL',
          createNew: 'Crear Nuevo Sitio',
          createNewNote:
            'Nota: Crear un nuevo sitio borrará este registro. Asegúrese de hacer una copia de su URL y guardarla para poder ver este sitio más adelante.',
        },
        siteStatistics: {
          overallSuitabilityOffshore: 'Idoneidad general (Costa afuera)',
          overallSuitabilityOnshore: 'Idoneidad general (Zona costera)',
          avgScore: 'Puntuación promedio',
          area: 'Área',
          siteCorners: 'Esquinas del sitio',
          dd: 'grados decimales',
        },
        report: {
          title:
            'Idoneidad del sitio para la acuicultura. Península de Baja California - México',
          statistics: 'Estadísticas del sitio',
          parameters: 'Parámetros del sitio',
          siteMap: 'Mapa del sitio',
        },
      },
      language: 'spanish',
    },
    // app state info -- supporting layers
    tree: { ticked: [], expanded: [], tickedObj: [] },
    setTicked: {},
    clearLayers: true,
    selectedLayerList: [],
    supportingVisibleLayerOpacity: {},
    firstLoad: false,
    //user info
    userProcess: {
      siteCreated: false,
      drawStatus: '',
      printStatus: '',
      species: 'none',
    },
    userSiteMap: {
      drawAcres: '',
      mapImageURI: '',
      customURL: '',
      siteURLCorners: '',
      siteCornersDecimalDegrees: '',
    },
    userResults: {
      rasterStatistics: '',
      suitabilityStatistics: false,
      zeros: '',
      warnings: '',
      avgSuitability: '',
      overallSuitability: '',
      species: '',
    },
  },
  getters: {
    langObj(state) {
      let langObj =
        state.config.language == 'english'
          ? state.config.languageEnglish
          : state.config.languageSpanish;
      return langObj;
    },
  },
  mutations: {
    //data retrieved from web services
    updateSupportingLayers(state, obj) {
      state.data.supportingLayers = obj;
    },
    updateSLReady(state, bool) {
      state.data.slReady = bool;
    },
    //the following functions update the supporting layers tree object
    updateTreeState(state, obj) {
      if (obj.ticked) {
        state.tree.ticked = obj.ticked;
      }
      if (obj.expanded) {
        state.tree.expanded = obj.expanded;
      }
      if (obj.tickedObj) {
        state.tree.tickedObj = obj.tickedObj;
      }
    },
    updateSetTicked(state, obj) {
      //set obj setTicked ({tick: [], untick: []})
      state.setTicked = obj;
    },
    clearLayers(state) {
      //this just changes the value to provoke the watcher
      state.clearLayers = !state.clearLayers;
    },

    updateSupportingLayerVisibleOpacity(state, obj) {
      state.supportingVisibleLayerOpacity = obj;
    },

    //update user state
    updateUserProcess(state, obj) {
      state.userProcess = obj;
    },

    //update language
    updateLanguage(state, val) {
      state.config.language = val;
    },

    //the following functions update siteUserMap object
    updateMapImageURI(state, val) {
      state.userSiteMap.mapImageURI = val;
    },
    updateDrawAcres(state, val) {
      state.userSiteMap.drawAcres = val;
    },
    updateCustomURLCorners(state, obj) {
      state.userSiteMap.customURL =
        window.location.origin +
        '/palau/#/create?corners=' +
        encodeURIComponent(obj);
    },
    updateCornersDecimalDegrees(state, obj) {
      state.userSiteMap.siteCornersDecimalDegrees = obj;
    },
    updateCustomURLSpecies(state, species) {
      state.userSiteMap.customURL =
        state.userSiteMap.customURL + '&species=' + species;
    },
    makeSiteFromURL(state, corners) {
      state.userSiteMap.siteURLCorners = corners;
    },

    //the following functions update the userResultsObjects
    updateUserResultsSuitability(state, suitability) {
      state.userResults.zeros = suitability.zeros;
      state.userResults.warnings = suitability.warnings;
      state.userResults.species = suitability.species;
      state.userResults.suitabilityStatistics = true;
    },
    updateUserResultsRasterStats(state, rasterStats) {
      console.log(rasterStats);
      state.userResults.rasterStatistics = rasterStats;
    },
    updateUserResultsAvgSuitability(state, results) {
      state.userResults.avgSuitability = results;
    },
    updateUserResultsOverallSuitability(state, overall) {
      state.userResults.overallSuitability = overall;
    },
    clearUserResults(state) {
      state.userResults = {
        rasterStatistics: '',
        suitabilityStatistics: false,
        zeros: '',
        warnings: '',
        avgSuitability: '',
        overallSuitability: '',
        drawAcres: '',
        species: '',
      };
    },
  },
  actions: {
    requestSupportingLayers(context) {
      //for each map service object in supporting map layers
      let obj = [];
      let smnum = context.state.config.supportingMapLayers.length;
      let smcount = 0;
      context.state.config.supportingMapLayers.forEach((service, index) => {
        esriRequest(service.mapService + '/layers?f=pjson', {
          responseType: 'json',
        }).then(function(response) {
          let layerJson = response.data.layers;
          //push main header to the object
          obj.push({
            label: context.getters.langObj.supportingLayers.layersTitle,
            children: [],
            id: 999 + index,
            noTick: true,
            type: 'header',
          });
          let storeNodes = [];
          let type = '';
          layerJson.forEach((l) => {
            service.popupTemplate.forEach((popup) => {
              if (l.id == popup.id) {
                type = 'Featue Layer';
              } else type = 'Raster Layer';
            });
            // add layer to layer viewer if it's id is not present in the skip array
            if (service.skipLayers.indexOf(l.id) == -1) {
              // Group Layer with no parent
              if (l.type == 'Group Layer' && !l.parentLayer) {
                //push the object to the list as child of main header
                obj[index].children.push({
                  label: l.name,
                  children: [],
                  id: l.id + '_' + index,
                  noTick: true,
                  type: type,
                });
                //find the index of the object we just pushed, saves the reference to the location
                let parentIndex = obj[index].children.findIndex(
                  (obj) => obj.id == l.id + '_' + index
                );
                //save the parent node to the store with reference to its location in the object
                storeNodes.push({
                  parentIndex: parentIndex,
                  parentLoc: obj[index].children[parentIndex],
                  parentId: l.id + '_' + index,
                  description: l.description,
                });
              }
              // featurel layer with parent
              if (l.type !== 'Group Layer' && l.parentLayer) {
                //find the location of the parent in the node lookup
                let nodesIndex = storeNodes.findIndex(
                  (obj) => obj.parentId == l.parentLayer.id + '_' + index
                );
                //set the location of the parent
                let parentLoc = storeNodes[nodesIndex].parentLoc;
                //push the child to the parent
                parentLoc.children.push({
                  label: l.name,
                  children: [],
                  body: 'toggle',
                  id: l.id + '_' + index,
                  description: l.description,
                  type: type,
                });
              }
              // group layer with parent
              if (l.type == 'Group Layer' && l.parentLayer) {
                //find the location of the parent in the node lookup
                let nodesIndex = storeNodes.findIndex(
                  (obj) => obj.parentId == l.parentLayer.id + '_' + index
                );
                //set the location of the parent
                let parentLoc = storeNodes[nodesIndex].parentLoc;
                //push the new parent into the found parent as child
                parentLoc.children.push({
                  label: l.name,
                  children: [],
                  id: l.id + '_' + index,
                  noTick: true,
                  type: type,
                });
                //find the index of the child we just pushed
                let parentIndex = parentLoc.children.findIndex(
                  (obj) => obj.id == l.id + '_' + index
                );
                //save the reference to the location
                parentLoc = parentLoc.children[parentIndex];
                //save the parent node to the store with reference to its location in the object
                storeNodes.push({
                  parentIndex: parentIndex,
                  parentLoc: parentLoc,
                  parentId: l.id + '_' + index,
                  description: l.description,
                });
              }
              // feature layer with no parent length = number of nodes
              if (l.type !== 'Group Layer' && !l.parentLayer) {
                obj[index].children.push({
                  label: l.name,
                  children: [],
                  body: 'toggle',
                  id: l.id + '_' + index,
                  description: l.description,
                  type: type,
                });
              }
            }
          });
          smcount = smcount + 1;
          if (smcount == smnum) {
            context.commit('updateSupportingLayers', obj);
            context.commit('updateSLReady', true);
          }
        });
      });
    },
  },
  modules: {},
});
