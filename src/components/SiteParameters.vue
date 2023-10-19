<template>
  <div v-if="$store.state.userResults.suitabilityStatistics">
    <q-list bordered class="q-mb-md">
      <div v-for="(item, index) in resultsData" :key="index">
        <q-expansion-item
          dense
          dense-toggle
          expand-separator
          header-class="text-primary"
          style="border-bottom: 1px solid #195f64"
          default-opened
        >
          <template v-slot:header>
            <q-item-section avatar>
              <q-icon
                :name="item.sectionIcon"
                color="primary"
                text-color="primary"
              />
            </q-item-section>
            <!--Section Name Expand -->
            <q-item-section>
              {{ item.sectionName }}
            </q-item-section>

            <q-item-section side>
              <!-- Section summary error count section-->
              <div class="row items-center">
                <q-badge
                  color="red"
                  outline
                  v-if="report.sectionSummary[index].sectionOverall == 'close'"
                >
                  {{ report.sectionSummary[index].sectionSummary.errors }}
                  <q-icon name="close" color="red" class="q-ml-xs" />
                </q-badge>
                <q-badge
                  color="yellow"
                  outline
                  v-if="
                    report.sectionSummary[index].sectionOverall ==
                      'warning_amber'
                  "
                >
                  {{ report.sectionSummary[index].sectionSummary.warnings }}
                  <q-icon name="warning_amber" color="yellow" class="q-ml-xs" />
                </q-badge>
              </div>
            </q-item-section>
          </template>
          <q-separator color="primary" />
          <div
            v-for="(param, index) in resultsData[index].sectionData"
            :key="index"
          >
            <q-item>
              <!--Name section -->
              <q-item-section>
                <q-item-label>{{ param.name }}</q-item-label>
                <q-item-label
                  class="text-red"
                  v-if="param.meetsRule.icon == 'close'"
                  caption
                  >{{ param.description }}
                </q-item-label>
                <q-item-label
                  class="text-grey-6"
                  v-if="
                    param.meetsRule.icon == 'warning_amber' ||
                      param.meetsRule.icon == 'check'
                  "
                  caption
                  >{{ param.description }}
                </q-item-label>

                <q-item-label
                  class="text-caption q-mb-none text-grey-6"
                  v-if="param.statValues"
                >
                  Avg:
                  {{ new Intl.NumberFormat().format(param.statValues.avg) }}
                  &nbsp; | &nbsp; Min:
                  {{ new Intl.NumberFormat().format(param.statValues.min) }}
                  &nbsp; | &nbsp; Max:
                  {{ new Intl.NumberFormat().format(param.statValues.max) }}
                </q-item-label>
              </q-item-section>

              <!--rule button section -->
              <q-item-section side center>
                <q-btn
                  size="12px"
                  push
                  flat
                  round
                  :color="param.meetsRule.color"
                  :icon="param.meetsRule.icon"
                >
                  <q-popup-proxy style="width:50%">
                    <q-banner>
                      <!--p class="text-subtitle2 text-primary q-mb-none">Rule </p>
                    {{param.rule}}
                    <br/><br/-->
                      <p class="text-subtitle2 text-primary q-mb-none">
                        Description
                      </p>
                      <p class="q-mb-md">
                        {{ param.description }}
                      </p>
                      <q-item-label
                        class="text-caption"
                        v-if="param.statValues"
                      >
                        Avg:
                        {{
                          new Intl.NumberFormat().format(param.statValues.avg)
                        }}
                        &nbsp; | &nbsp; Min:
                        {{
                          new Intl.NumberFormat().format(param.statValues.min)
                        }}
                        &nbsp; | &nbsp; Max:
                        {{
                          new Intl.NumberFormat().format(param.statValues.max)
                        }}
                      </q-item-label>
                      <br />
                      <p
                        :style="'color: ' + param.meetsRule.color"
                        class="text-caption"
                      >
                        Score:
                        <br />
                        <span style="font-size: 20px"
                          ><q-icon
                            :name="param.meetsRule.icon"
                            :class="'text-' + param.meetsRule.color"
                        /></span>
                        {{ param.meetsRule.val }}
                      </p>
                    </q-banner>
                  </q-popup-proxy>
                </q-btn>
              </q-item-section>

              <!--Description button section -->
              <q-item-section side center class="q-pl-none print-hide">
                <q-btn
                  size="12px"
                  flat
                  round
                  :color="
                    selectedList.indexOf(param.name) < 0 ? 'grey-5' : 'primary'
                  "
                  icon="layers"
                >
                  <q-menu
                    anchor="bottom left"
                    self="top right"
                    persistent
                    @hide="hideLayers(param.layers, param.name)"
                    @show="showBanner(param.layers, param.name)"
                    style="width:30%"
                  >
                    <q-banner dark class="bg-primary">
                      <p class="text-subtitle2 text-white q-mb-none">
                        Associated Layers
                      </p>
                      <q-separator color="grey-2" />
                      <br />
                      <p class="text-caption text-white q-ma-none">
                        {{ param.name }}
                      </p>
                      <div v-for="(layer, index) in param.layers" :key="index">
                        <q-checkbox
                          dark
                          v-model="viewLayers"
                          @update:model-value="showLayers(val, param.layers)"
                          :val="layer.id"
                          size="xs"
                          :label="layer.name"
                        />
                      </div>
                      <q-btn
                        class="float-right"
                        label="OK"
                        color="white"
                        flat
                        v-close-popup
                      />
                    </q-banner>
                  </q-menu>
                </q-btn>
              </q-item-section>
            </q-item>
            <q-separator inset />
          </div>
        </q-expansion-item>
      </div>
    </q-list>
  </div>
</template>

<script>
export default {
  name: 'SiteParameters',
  components: {},
  data() {
    return {
      viewLayers: [],
      selectedList: [],
    };
  },

  methods: {
    //these 3 functions show / hide associated layers
    showBanner(layers, name) {
      let layerIds = [];
      layers.forEach((layer) => {
        layerIds.push(layer.id);
      });
      this.viewLayers = layerIds;
      this.$store.commit('updateSetTicked', { tick: layerIds, untick: [] });
      this.selectedList.push(name);
    },
    showLayers(val, layers) {
      let layerIds = [];
      layers.forEach((layer) => {
        if (!this.viewLayers.includes(layer.id)) {
          layerIds.push(layer.id);
        }
      });
      this.$store.commit('updateSetTicked', {
        tick: this.viewLayers,
        untick: layerIds,
      });
    },
    hideLayers(layers, name) {
      let layerIds = [];
      layers.forEach((layer) => {
        layerIds.push(layer.id);
      });
      this.$store.commit('updateSetTicked', { tick: [], untick: layerIds });
      this.viewLayers = [];
      if (this.selectedList.indexOf(name) > -1) {
        this.selectedList.splice(this.selectedList.indexOf(name), 1);
      }
    },

    //compiles the errors and warnings for the users site into an object
    calcErrorReport() {
      let report = {
        totalWarnings: 0,
        totalErrors: 0,
        totalSuccess: 0,
        overallSuitability: '',
        sectionSummary: [],
      };
      let reportWarnings = 0;
      let reportErrors = 0;
      let reportSuccess = 0;
      this.resultsData.forEach((section) => {
        let sectionWarnings = 0;
        let sectionErrors = 0;
        let sectionSuccess = 0;
        let overall = '';
        section.sectionData.forEach((param) => {
          if (param.meetsRule.icon == 'check') {
            reportSuccess = reportSuccess + 1;
            sectionSuccess = sectionSuccess + 1;
          }
          if (param.meetsRule.icon == 'warning_amber') {
            reportWarnings = reportWarnings + 1;
            sectionWarnings = sectionWarnings + 1;
          }
          if (param.meetsRule.icon == 'close') {
            reportErrors = reportErrors + 1;
            sectionErrors = sectionErrors + 1;
          }
        });
        if (sectionErrors > 0) {
          overall = 'close';
        }
        if (sectionErrors == 0 && sectionWarnings > 0) {
          overall = 'warning_amber';
        }
        if (sectionErrors == 0 && sectionWarnings == 0) {
          overall = 'check';
        }
        let sectionOb = {
          sectionName: section.sectionName,
          sectionIcon: section.sectionIcon,
          sectionSummary: {
            warnings: sectionWarnings,
            errors: sectionErrors,
            successes: sectionSuccess,
          },
          sectionOverall: overall,
        };
        report.sectionSummary.push(sectionOb);
      });
      report.totalWarnings = reportWarnings;
      report.totalErrors = reportErrors;
      report.totalSuccess = reportSuccess;

      if (reportErrors > 0) {
        report.overallSuitability = 'Poorly Suitable';
      }
      if (reportErrors == 0 && reportWarnings > 0) {
        report.overallSuitability = 'Further Site Review Needed';
      }
      if (reportErrors == 0 && reportWarnings == 0) {
        report.overallSuitability = 'Suitable';
      }
      // if (this.$store.state.userResults.rasterStatistics == 'out of bounds') {
      //   report.overallSuitability = 'Outside Study Area';
      // }
      this.$store.commit(
        'updateUserResultsOverallSuitability',
        report.overallSuitability
      );
      return report;
    },

    //this function is called from the data object for each object we check the list to see if the field name(s)
    //is a warning or error
    calcZeros(fieldNames) {
      //get zeros list
      let zeros = this.$store.state.userResults.zeros;
      let warnings = this.$store.state.userResults.warnings;
      let err = 0;
      let warn = 0;
      let suitable = { val: 'Suitable', icon: 'check', color: 'green' };

      fieldNames.forEach((field) => {
        //look for warnings
        if (
          (warnings.length > 0 && warnings.includes(field)) ||
          field == 'alwaysWarn'
        ) {
          warn = warn + 1;
        }

        //look for errors
        if (zeros.length > 0 && zeros.includes(field)) {
          err = err + 1;
        }
      });

      if (warn > 0) {
        suitable = {
          val: 'Further Evaluation Needed',
          icon: 'warning_amber',
          color: 'warning',
        };
      }
      if (err > 0) {
        suitable = { val: 'Poorly Suitable', icon: 'close', color: 'red' };
      }
      return suitable;
    },
  },
  computed: {
    report() {
      let report = this.calcErrorReport();
      return report;
    },
    resultsData() {
      return this.$store.state.userResults.species == 'onshore'
        ? this.onshore
        : this.offshore;
    },

    //this is the data object that holds the sections and info
    offshore() {
      return [
        {
          sectionName: 'Ambiental',
          sectionIcon: 'language',

          sectionData: [
            {
              name: 'Ríos - Zona de influencia de 1 km',
              caption: '',

              value: '',

              meetsRule: this.calcZeros(['Mexico_River_1km_w']),

              rule: '',

              description:
                'Se deben evitar las desembocaduras de los ríos para el desarrollo de la acuicultura.',

              layers: [
                { name: 'Ríos - Zona de influencia de 1 km', id: '9_0' },
              ],
            },

            {
              name: 'Batimetría - metro',

              caption: '',

              value: '',

              //meetsRule: this.calcZeros(['Mexico_Bathy_GMRT_Focal']),
              meetsRule: this.calcZeros(['alwaysWarn']),
              rule: '',

              description:
                'Las operaciones de acuicultura en aguas poco profundas pueden conducir a la deposición de desechos de pescado y exceso de alimento en el lecho marino, lo que puede causar contaminación e impacto por nutrientes.',
              statValues: {
                avg: this.$store.state.userResults.rasterStatistics.avg_depth,
                min: this.$store.state.userResults.rasterStatistics.min_depth,
                max: this.$store.state.userResults.rasterStatistics.max_depth,
              },

              layers: [{ name: 'Batimetría - metro', id: '12_0' }],
            },

            {
              name: 'Clorofila a (mg m-3)',

              caption: '',

              value: '',

              //meetsRule: this.calcZeros(['Mexico_Chla_10yr_Avg_200']),
              meetsRule: this.calcZeros(['alwaysWarn']),

              rule: '',

              description:
                'Las áreas con alto contenido de clorofila pueden no ser adecuadas para todas las especies, esto podría ser un indicador de un exceso de escorrentía.',

              statValues: {
                avg: this.$store.state.userResults.rasterStatistics.avg_chlor,
                min: this.$store.state.userResults.rasterStatistics.min_chlor,
                max: this.$store.state.userResults.rasterStatistics.max_chlor,
              },
              layers: [{ name: 'Clorofila a (mg m-3)', id: '13_0' }],
            },

            {
              name: 'Velocidad de la corriente oceánica (m/s), 2010 - 2020',

              caption: '',

              value: '',

              //meetsRule: this.calcZeros(['Mexico_Current_2010_2020_200']),
              meetsRule: this.calcZeros(['alwaysWarn']),

              rule: '',

              description:
                'Las áreas con altas velocidades de corriente pueden no ser adecuadas.',

              statValues: {
                avg: this.$store.state.userResults.rasterStatistics.avg_current,
                min: this.$store.state.userResults.rasterStatistics.min_current,
                max: this.$store.state.userResults.rasterStatistics.max_current,
              },
              layers: [
                {
                  name: 'Velocidad de la corriente oceánica (m/s), 2010 - 2020',

                  id: '14_0',
                },
              ],
            },

            {
              name:
                'Trayectorias de huracanes y velocidad del viento, 1990-2021',
              caption: '',
              value: '',
              // meetsRule: this.calcZeros(['Mexico_Hurricane_1990_2021_Wind_200',]),
              meetsRule: this.calcZeros(['alwaysWarn']),
              rule: '',
              description:
                'Evite áreas conocidas de alta ocurrencia de huracanes.',
              statValues: {
                avg: this.$store.state.userResults.rasterStatistics.avg_wind,
                min: this.$store.state.userResults.rasterStatistics.min_wind,
                max: this.$store.state.userResults.rasterStatistics.max_wind,
              },
              layers: [
                {
                  name:
                    'Trayectorias de huracanes y velocidad del viento, 1990-2021',

                  id: '15_0',
                },
              ],
            },

            {
              name: 'Kd490',

              caption: '',

              value: '',

              meetsRule: this.calcZeros(['Mexico_Kd490_10yr_Avg_200']),

              rule: '',

              description:
                'Kd490 es una medida de turbidez, se deben evitar áreas con un valor alto',

              layers: [{ name: 'Kd490', id: '16_0' }],
            },

            {
              name: 'Salinidad del océano (ppt)',
              caption: '',
              value: '',
              //meetsRule: this.calcZeros(['Mexico_Salinity_10yr_Avg_200']),
              meetsRule: this.calcZeros(['alwaysWarn']),
              rule: '',
              description:
                'La salinidad del océano es importante para las especies acuícolas.',

              statValues: {
                avg: this.$store.state.userResults.rasterStatistics
                  .avg_salinity,
                min: this.$store.state.userResults.rasterStatistics
                  .min_salinity,
                max: this.$store.state.userResults.rasterStatistics
                  .max_salinity,
              },
              layers: [{ name: 'Salinidad del océano (ppt)', id: '17_0' }],
            },

            {
              name: 'Temperatura de la superficie del mar (SST)',

              caption: '',

              value: '',

              //meetsRule: this.calcZeros(['Mexico_SST_10yr_Avg_200']),
              meetsRule: this.calcZeros(['alwaysWarn']),

              rule: '',

              description:
                'Las temperaturas que no son las ideales pueden causar efectos negativos en las especies acuícolas y pueden provocar un crecimiento lento, enfermedades y la muerte.',
              statValues: {
                avg: this.$store.state.userResults.rasterStatistics.avg_temp,
                min: this.$store.state.userResults.rasterStatistics.min_temp,
                max: this.$store.state.userResults.rasterStatistics.max_temp,
              },
              layers: [
                {
                  name: 'Temperatura de la superficie del mar (SST)',

                  id: '18_0',
                },
              ],
            },

            {
              name: 'Altura de ola significativa (m)',

              caption: '',

              value: '',

              //meetsRule: this.calcZeros(['Mexico_Wave_2021_200']),
              meetsRule: this.calcZeros(['alwaysWarn']),

              rule: '',

              description:
                'Cuando las olas son demasiado altas, es cada vez más difícil visitar un sitio para alimentar y mantener el equipo. En condiciones de olas severas, el equipo puede soltarse o romperse.',

              statValues: {
                avg: this.$store.state.userResults.rasterStatistics.avg_wheight,
                min: this.$store.state.userResults.rasterStatistics.min_wheight,
                max: this.$store.state.userResults.rasterStatistics.max_wheight,
              },

              layers: [{ name: 'Altura de ola significativa (m)', id: '20_0' }],
            },
          ],
        },

        {
          sectionName: 'Infraestructura',

          sectionIcon: 'houseboat',

          sectionData: [
            {
              SectionName: 'Infraestructura',

              SectionIcon: 'houseboat',

              name: 'Puertos - Zona de influencia de 20 km',

              caption: '',

              value: '',

              meetsRule: this.calcZeros(['Baja_All_Ports_20km_w']),

              rule: '',

              description:
                'Los puertos son una infraestructura importante para las operaciones en alta mar.',

              layers: [
                { name: 'Puertos - Zona de influencia de 20 km', id: '21_0' },
              ],
            },

            {
              SectionName: 'Infraestructura',

              SectionIcon: 'houseboat',

              name: 'Carreteras - Zona de influencia de 5 km',

              caption: '',

              value: '',

              meetsRule: this.calcZeros(['Baja_Roads_OSM_5km_w']),

              rule: '',

              description:
                'Las carreteras son una infraestructura importante para las operaciones en alta mar.',

              layers: [
                { name: 'Carreteras - Zona de influencia de 5 km', id: '22_0' },
              ],
            },

            {
              SectionName: 'Infraestructura',

              SectionIcon: 'houseboat',

              name: 'Rutas de ferry',

              caption: '',

              value: '',

              meetsRule: this.calcZeros(['Mexico_Ferry_Routes_500m_w']),

              rule: '',

              description: 'Evite áreas importantes para rutas de ferry.',

              layers: [
                {
                  name: 'Rutas de ferry - Zona de influencia de 500 m',

                  id: '23_0',
                },
              ],
            },

            {
              SectionName: 'Infraestructura',

              SectionIcon: 'houseboat',

              name: 'Instalación de aguas residuales',

              caption: '',

              value: '',

              meetsRule: this.calcZeros(['Plantas_tratam_5km_w']),

              rule: '',

              description:
                'Evite áreas cercanas a instalaciones de tratamiento de aguas residuales.',

              layers: [
                {
                  name:
                    'Instalación de aguas residuales - Zona de influencia de 500 m',

                  id: '24_0',
                },
              ],
            },

            {
              SectionName: 'Infraestructura',

              SectionIcon: 'houseboat',

              name: 'Sitios de acuicultura',

              caption: '',

              value: '',

              meetsRule: this.calcZeros([
                'Mexico_Aqua_Process_500m_w',

                'Mexico_Aqua_Current_500m_w',
              ]),

              rule: '',

              description:
                'Minimizar el potencial de bioseguridad y problemas de transmisión de enfermedades entre las operaciones acuícolas existentes y futuras.',

              layers: [
                {
                  name: 'Sitios de acuicultura - Zona de influencia de 500 m',

                  id: '25_0',
                },
              ],
            },

            {
              SectionName: 'Infraestructura',

              SectionIcon: 'houseboat',

              name:
                'Localización y Monitoreo Satelital de Embarcaciones Pesqueras - 2018 - 2022',

              caption: '',

              value: '',

              meetsRule: this.calcZeros([
                'Baja_msep_vessels_2018_200',
                'Baja_msep_vessels_2019_200',
                'Baja_msep_vessels_2020_200',
                'Baja_msep_vessels_2021_200',
                'Baja_msep_vessels_2022_200',
              ]),

              rule: '',

              description:
                'Deben evitarse las zonas con alta actividad pesquera.',

              layers: [
                {
                  name:
                    'Localización y Monitoreo Satelital de Embarcaciones Pesqueras - 2018 - 2022',

                  id: '27_0',
                },
              ],
            },

            {
              SectionName: 'Infraestructura',

              SectionIcon: 'houseboat',

              name: 'Densidad de buques, 2015 - 2021',

              caption: '',

              value: '',

              //meetsRule: this.calcZeros(['Mexico_Ship_Density_200']),
              meetsRule: this.calcZeros(['alwaysWarn']),

              rule: '',

              description:
                'Deben evitarse las zonas de alta densidad de envío.',

              statValues: {
                avg: this.$store.state.userResults.rasterStatistics.avg_ship,
                min: this.$store.state.userResults.rasterStatistics.min_ship,
                max: this.$store.state.userResults.rasterStatistics.max_ship,
              },
              layers: [{ name: 'Densidad de buques, 2015 - 2021', id: '32_0' }],
            },
          ],
        },

        {
          sectionName: 'Recursos naturales',

          sectionIcon: 'spa',

          sectionData: [
            {
              name: 'Áreas Marinas Protegidas',

              caption: '',

              value: '',

              meetsRule: this.calcZeros([
                'Mexico_MPA_No_Take_w',
                'Mexico_MPA_w',
              ]),

              rule: '',

              description:
                'Evitar el conflicto entre la gestión de los recursos naturales y las operaciones de acuicultura.',

              layers: [{ name: 'Áreas Marinas Protegidas', id: '36_0' }],
            },

            {
              name: 'Zonas de Refugio Pesquero (ZRP)',

              caption: '',

              value: '',

              meetsRule: this.calcZeros(['Mexico_refugios_pesca_w']),

              rule: '',

              description:
                'Evitar el conflicto entre la gestión de los recursos naturales y las operaciones de acuicultura.',

              layers: [{ name: 'Zonas de Refugio Pesquero (ZRP)', id: '40_0' }],
            },

            {
              name: 'Áreas de conservación de humedales RAMSAR',

              caption: '',

              value: '',

              meetsRule: this.calcZeros(['Mexico_MPA_Ramsar_w']),

              rule: '',

              description:
                'Evitar, cuando sea posible, áreas designadas como áreas de conservación de humedales RAMSAR.',

              layers: [
                {
                  name: 'Áreas de conservación de humedales RAMSAR',

                  id: '38_0',
                },
              ],
            },

            {
              name: 'Áreas de manglares - Zona de influencia de 50 m',

              caption: '',

              value: '',

              meetsRule: this.calcZeros(['Mexico_Mangrove_50m_w']),

              rule: '',

              description:
                'Las áreas de manglares deben evitarse cuando sea posible.',

              layers: [
                {
                  name: 'Áreas de manglares - Zona de influencia de 50 m',

                  id: '34_0',
                },
              ],
            },

            {
              name:
                'Áreas de manglares amenazadas - Zona de influencia de 500 m',

              caption: '',

              value: '',

              meetsRule: this.calcZeros(['Mexico_Mangrove_Threat_500m_w']),

              rule: '',

              description:
                'Las áreas de manglares deben evitarse cuando sea posible.',

              layers: [
                {
                  name:
                    'Áreas de manglares amenazadas - Zona de influencia de 500 m',

                  id: '35_0',
                },
              ],
            },
          ],
        },

        {
          sectionName: 'Socioculturales',

          sectionIcon: 'people',

          sectionData: [
            {
              name: 'Resultados del mapeo comunitario - Puntos',

              caption: '',

              value: '',

              meetsRule: this.calcZeros(['Felt_Pts_500m_Proj_w']),

              rule: '',

              description:
                'A través de un enfoque de mapeo comunitario se identificaron las áreas consideradas adecuadas.',

              layers: [
                {
                  name: 'Resultados del mapeo comunitario - Puntos',

                  id: '44_0',
                },
              ],
            },

            {
              name: 'Resultados del mapeo comunitario - Líneas',

              caption: '',

              value: '',

              meetsRule: this.calcZeros(['Felt_Lines_500m_Proj_w']),

              rule: '',

              description:
                'A través de un enfoque de mapeo comunitario se identificaron las áreas consideradas adecuadas.',

              layers: [
                {
                  name: 'Resultados del mapeo comunitario - Líneas',

                  id: '42_0',
                },
              ],
            },

            {
              name: 'Resultados del mapeo comunitario - Polígonos',

              caption: '',

              value: '',

              meetsRule: this.calcZeros(['Felt_Poly_Proj_w']),

              rule: '',

              description:
                'A través de un enfoque de mapeo comunitario se identificaron las áreas consideradas adecuadas.',

              layers: [
                {
                  name: 'Resultados del mapeo comunitario - Polígonos',

                  id: '43_0',
                },
              ],
            },
          ],
        },
      ];
    },

    onshore() {
      return [
        {
          sectionName: 'Ambiental',
          sectionIcon: 'language',

          sectionData: [
            {
              name: 'Bahías',

              caption: '',

              value: '',

              meetsRule: this.calcZeros(['Baja_All_Bays_w']),

              rule: '',

              description:
                'Las bahías ofrecen protección contra el medio ambiente.',

              layers: [{ name: 'Bahías', id: '8_0' }],
            },

            {
              name: 'Ríos - Zona de influencia de 1 km',

              caption: '',

              value: '',

              meetsRule: this.calcZeros(['Mexico_River_1km_w']),

              rule: '',

              description:
                'Se deben evitar las desembocaduras de los ríos para el desarrollo de la acuicultura.',

              layers: [
                { name: 'Ríos - Zona de influencia de 1 km', id: '9_0' },
              ],
            },

            {
              name: 'Costa - Zona de influencia de 2 km',

              caption: '',

              value: '',

              meetsRule: this.calcZeros(['Mexico_Coast_2km_w']),

              rule: '',

              description: 'Las zonas cercanas a la costa son más adecuadas.',

              layers: [
                { name: 'Costa - Zona de influencia de 2 km', id: '10_0' },
              ],
            },

            {
              name: 'Batimetría - metro',

              caption: '',

              value: '',

              //meetsRule: this.calcZeros(['Mexico_Bathy_GMRT_Focal']),
              meetsRule: this.calcZeros(['alwaysWarn']),
              statValues: {
                avg: this.$store.state.userResults.rasterStatistics.avg_depth,
                min: this.$store.state.userResults.rasterStatistics.min_depth,
                max: this.$store.state.userResults.rasterStatistics.max_depth,
              },
              rule: '',

              description:
                'Las operaciones de acuicultura en aguas poco profundas pueden conducir a la deposición de desechos de pescado y exceso de alimento en el lecho marino, lo que puede causar contaminación e impacto por nutrientes.',

              layers: [{ name: 'Batimetría - metro', id: '12_0' }],
            },

            {
              name: 'Clorofila a (mg m-3)',

              caption: '',

              value: '',

              //meetsRule: this.calcZeros(['Mexico_Chla_10yr_Avg_200']),
              meetsRule: this.calcZeros(['alwaysWarn']),
              statValues: {
                avg: this.$store.state.userResults.rasterStatistics.avg_chlor,
                min: this.$store.state.userResults.rasterStatistics.min_chlor,
                max: this.$store.state.userResults.rasterStatistics.max_chlor,
              },
              rule: '',

              description:
                'Las áreas con alto contenido de clorofila pueden no ser adecuadas para todas las especies, esto podría ser un indicador de un exceso de escorrentía.',

              layers: [{ name: 'Clorofila a (mg m-3)', id: '13_0' }],
            },

            {
              name: 'Velocidad de la corriente oceánica (m/s), 2010 - 2020',

              caption: '',

              value: '',

              //meetsRule: this.calcZeros(['Mexico_Current_2010_2020_200']),
              meetsRule: this.calcZeros(['alwaysWarn']),
              statValues: {
                avg: this.$store.state.userResults.rasterStatistics.avg_current,
                min: this.$store.state.userResults.rasterStatistics.min_current,
                max: this.$store.state.userResults.rasterStatistics.max_current,
              },
              rule: '',

              description:
                'Las áreas con altas velocidades de corriente pueden no ser adecuadas.',

              layers: [
                {
                  name: 'Velocidad de la corriente oceánica (m/s), 2010 - 2020',

                  id: '14_0',
                },
              ],
            },

            {
              name:
                'Trayectorias de huracanes y velocidad del viento, 1990-2021',

              caption: '',

              value: '',

              // meetsRule: this.calcZeros(['Mexico_Hurricane_1990_2021_Wind_200',]),
              meetsRule: this.calcZeros(['alwaysWarn']),
              statValues: {
                avg: this.$store.state.userResults.rasterStatistics.avg_wind,
                min: this.$store.state.userResults.rasterStatistics.min_wind,
                max: this.$store.state.userResults.rasterStatistics.max_wind,
              },

              rule: '',

              description:
                'Evite áreas conocidas de alta ocurrencia de huracanes.',

              layers: [
                {
                  name:
                    'Trayectorias de huracanes y velocidad del viento, 1990-2021',

                  id: '15_0',
                },
              ],
            },

            {
              name: 'Kd490',

              caption: '',

              value: '',

              meetsRule: this.calcZeros(['Mexico_Kd490_10yr_Avg_200']),

              rule: '',

              description:
                'Kd490 es una medida de turbidez, se deben evitar áreas con un valor alto',

              layers: [{ name: 'Kd490', id: '16_0' }],
            },

            {
              name: 'Salinidad del océano (ppt)',

              caption: '',

              value: '',

              //meetsRule: this.calcZeros(['Mexico_Salinity_10yr_Avg_200']),
              meetsRule: this.calcZeros(['alwaysWarn']),
              statValues: {
                avg: this.$store.state.userResults.rasterStatistics
                  .avg_salinity,
                min: this.$store.state.userResults.rasterStatistics
                  .min_salinity,
                max: this.$store.state.userResults.rasterStatistics
                  .max_salinity,
              },

              rule: '',

              description:
                'La salinidad del océano es importante para las especies acuícolas.',

              layers: [{ name: 'Salinidad del océano (ppt)', id: '17_0' }],
            },

            {
              name: 'Temperatura de la superficie del mar (SST)',

              caption: '',

              value: '',

              //meetsRule: this.calcZeros(['Mexico_SST_10yr_Avg_200']),
              meetsRule: this.calcZeros(['alwaysWarn']),
              statValues: {
                avg: this.$store.state.userResults.rasterStatistics.avg_temp,
                min: this.$store.state.userResults.rasterStatistics.min_temp,
                max: this.$store.state.userResults.rasterStatistics.max_temp,
              },

              rule: '',

              description:
                'Las temperaturas que no son las ideales pueden causar efectos negativos en las especies acuícolas y pueden provocar un crecimiento lento, enfermedades y la muerte.',

              layers: [
                {
                  name: 'Temperatura de la superficie del mar (SST)',

                  id: '18_0',
                },
              ],
            },

            {
              name: 'Altura de ola significativa (m)',

              caption: '',

              value: '',

              //meetsRule: this.calcZeros(['Mexico_Wave_2021_200']),
              meetsRule: this.calcZeros(['alwaysWarn']),

              statValues: {
                avg: this.$store.state.userResults.rasterStatistics.avg_wheight,
                min: this.$store.state.userResults.rasterStatistics.min_wheight,
                max: this.$store.state.userResults.rasterStatistics.max_wheight,
              },

              rule: '',

              description:
                'Cuando las olas son demasiado altas, es cada vez más difícil visitar un sitio para alimentar y mantener el equipo. En condiciones de olas severas, el equipo puede soltarse o romperse.',

              layers: [{ name: 'Altura de ola significativa (m)', id: '20_0' }],
            },
          ],
        },

        {
          sectionName: 'Infraestructura',

          sectionIcon: 'houseboat',

          sectionData: [
            {
              SectionName: 'Infraestructura',

              SectionIcon: 'houseboat',

              name: 'Puertos - Zona de influencia de 20 km',

              caption: '',

              value: '',

              meetsRule: this.calcZeros(['Baja_All_Ports_20km_w']),

              rule: '',

              description:
                'Los puertos son una infraestructura importante para las operaciones en alta mar.',

              layers: [
                { name: 'Puertos - Zona de influencia de 20 km', id: '21_0' },
              ],
            },

            {
              SectionName: 'Infraestructura',

              SectionIcon: 'houseboat',

              name: 'Carreteras - Zona de influencia de 5 km',

              caption: '',

              value: '',

              meetsRule: this.calcZeros(['Baja_Roads_OSM_5km_w']),

              rule: '',

              description:
                'Las carreteras son una infraestructura importante para las operaciones en alta mar.',

              layers: [
                { name: 'Carreteras - Zona de influencia de 5 km', id: '22_0' },
              ],
            },

            {
              SectionName: 'Infraestructura',

              SectionIcon: 'houseboat',

              name: 'Rutas de ferry',

              caption: '',

              value: '',

              meetsRule: this.calcZeros(['Mexico_Ferry_Routes_500m_w']),

              rule: '',

              description: 'Evite áreas importantes para rutas de ferry.',

              layers: [
                {
                  name: 'Rutas de ferry - Zona de influencia de 500 m',

                  id: '23_0',
                },
              ],
            },

            {
              SectionName: 'Infraestructura',

              SectionIcon: 'houseboat',

              name: 'Instalación de aguas residuales',

              caption: '',

              value: '',

              meetsRule: this.calcZeros(['Plantas_tratam_5km_w']),

              rule: '',

              description:
                'Evite áreas cercanas a instalaciones de tratamiento de aguas residuales.',

              layers: [
                {
                  name:
                    'Instalación de aguas residuales - Zona de influencia de 500 m',

                  id: '24_0',
                },
              ],
            },

            {
              SectionName: 'Infraestructura',

              SectionIcon: 'houseboat',

              name: 'Sitios de acuicultura',

              caption: '',

              value: '',

              meetsRule: this.calcZeros([
                'Mexico_Aqua_Process_500m_w',

                'Mexico_Aqua_Current_500m_w',
              ]),

              rule: '',

              description:
                'Minimizar el potencial de bioseguridad y problemas de transmisión de enfermedades entre las operaciones acuícolas existentes y futuras.',

              layers: [
                {
                  name: 'Sitios de acuicultura - Zona de influencia de 500 m',

                  id: '25_0',
                },
              ],
            },

            {
              SectionName: 'Infraestructura',

              SectionIcon: 'houseboat',

              name:
                'Localización y Monitoreo Satelital de Embarcaciones Pesqueras - 2018 - 2022',

              caption: '',

              value: '',

              meetsRule: this.calcZeros([
                'Baja_msep_vessels_2018_200',
                'Baja_msep_vessels_2019_200',
                'Baja_msep_vessels_2020_200',
                'Baja_msep_vessels_2021_200',
                'Baja_msep_vessels_2022_200',
              ]),

              rule: '',

              description:
                'Deben evitarse las zonas con alta actividad pesquera.',

              layers: [
                {
                  name:
                    'Localización y Monitoreo Satelital de Embarcaciones Pesqueras - 2018 - 2022',

                  id: '27_0',
                },
              ],
            },

            {
              SectionName: 'Infraestructura',

              SectionIcon: 'houseboat',

              name: 'Densidad de buques, 2015 - 2021',

              caption: '',

              value: '',

              //meetsRule: this.calcZeros(['Mexico_Ship_Density_200']),
              meetsRule: this.calcZeros(['alwaysWarn']),
              statValues: {
                avg: this.$store.state.userResults.rasterStatistics.avg_ship,
                min: this.$store.state.userResults.rasterStatistics.min_ship,
                max: this.$store.state.userResults.rasterStatistics.max_ship,
              },

              rule: '',

              description:
                'Deben evitarse las zonas de alta densidad de envío.',

              layers: [{ name: 'Densidad de buques, 2015 - 2021', id: '32_0' }],
            },
          ],
        },

        {
          sectionName: 'Recursos naturales',

          sectionIcon: 'spa',

          sectionData: [
            {
              name: 'Áreas Marinas Protegidas',

              caption: '',

              value: '',

              meetsRule: this.calcZeros([
                'Mexico_MPA_No_Take_w',
                'Mexico_MPA_w',
              ]),

              rule: '',

              description:
                'Evitar el conflicto entre la gestión de los recursos naturales y las operaciones de acuicultura.',

              layers: [{ name: 'Áreas Marinas Protegidas', id: '36_0' }],
            },

            {
              name: 'Zonas de Refugio Pesquero (ZRP)',

              caption: '',

              value: '',

              meetsRule: this.calcZeros(['Mexico_refugios_pesca_w']),

              rule: '',

              description:
                'Evitar el conflicto entre la gestión de los recursos naturales y las operaciones de acuicultura.',

              layers: [{ name: 'Zonas de Refugio Pesquero (ZRP)', id: '40_0' }],
            },

            {
              name: 'Áreas de conservación de humedales RAMSAR',

              caption: '',

              value: '',

              meetsRule: this.calcZeros(['Mexico_MPA_Ramsar_w']),

              rule: '',

              description:
                'Evitar, cuando sea posible, áreas designadas como áreas de conservación de humedales RAMSAR.',

              layers: [
                {
                  name: 'Áreas de conservación de humedales RAMSAR',

                  id: '38_0',
                },
              ],
            },

            {
              name: 'Áreas de manglares - Zona de influencia de 50 m',

              caption: '',

              value: '',

              meetsRule: this.calcZeros(['Mexico_Mangrove_50m_w']),

              rule: '',

              description:
                'Las áreas de manglares deben evitarse cuando sea posible.',

              layers: [
                {
                  name: 'Áreas de manglares - Zona de influencia de 50 m',

                  id: '34_0',
                },
              ],
            },

            {
              name:
                'Áreas de manglares amenazadas - Zona de influencia de 500 m',

              caption: '',

              value: '',

              meetsRule: this.calcZeros(['Mexico_Mangrove_Threat_500m_w']),

              rule: '',

              description:
                'Las áreas de manglares deben evitarse cuando sea posible.',

              layers: [
                {
                  name:
                    'Áreas de manglares amenazadas - Zona de influencia de 500 m',

                  id: '35_0',
                },
              ],
            },
          ],
        },

        {
          sectionName: 'Socioculturales',

          sectionIcon: 'people',

          sectionData: [
            {
              name: 'Resultados del mapeo comunitario - Puntos',

              caption: '',

              value: '',

              meetsRule: this.calcZeros(['Felt_Pts_500m_Proj_w']),

              rule: '',

              description:
                'A través de un enfoque de mapeo comunitario se identificaron las áreas consideradas adecuadas.',

              layers: [
                {
                  name: 'Resultados del mapeo comunitario - Puntos',

                  id: '44_0',
                },
              ],
            },

            {
              name: 'Resultados del mapeo comunitario - Líneas',

              caption: '',

              value: '',

              meetsRule: this.calcZeros(['Felt_Lines_500m_Proj_w']),

              rule: '',

              description:
                'A través de un enfoque de mapeo comunitario se identificaron las áreas consideradas adecuadas.',

              layers: [
                {
                  name: 'Resultados del mapeo comunitario - Líneas',

                  id: '42_0',
                },
              ],
            },

            {
              name: 'Resultados del mapeo comunitario - Polígonos',

              caption: '',

              value: '',

              meetsRule: this.calcZeros(['Felt_Poly_Proj_w']),

              rule: '',

              description:
                'A través de un enfoque de mapeo comunitario se identificaron las áreas consideradas adecuadas.',

              layers: [
                {
                  name: 'Resultados del mapeo comunitario - Polígonos',

                  id: '43_0',
                },
              ],
            },
          ],
        },
      ];
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.q-item__section--main ~ .q-item__section--side {
  padding-left: 0px;
}
</style>
