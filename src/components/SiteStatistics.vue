<template>
  <q-markup-table dense bordered flat>
    <tbody>
      <tr>
        <td style="background-color: rgb(25,95,100, .1)" class="text-left">
          Overall Suitability ({{ $store.state.userResults.species }})
        </td>
        <td
          colspan="3"
          class="text-left text-green text-bold"
          v-if="
            $store.state.userResults.overallSuitability == 'Suitable' ||
              $store.state.userResults.overallSuitability ==
                'Further Site Review Needed'
          "
        >
          Suitable
        </td>
        <td
          colspan="3"
          class="text-left text-red"
          v-if="
            $store.state.userResults.overallSuitability == 'Poorly Suitable'
          "
        >
          {{ $store.state.userResults.overallSuitability }}
        </td>
        <td
          colspan="3"
          class="text-left text-black"
          v-if="
            $store.state.userResults.overallSuitability == 'Outside Study Area'
          "
        >
          Outside Study Area
        </td>
      </tr>
      <tr>
        <td style="background-color: rgb(25,95,100, .1)" class="text-left">
          Avg Score
        </td>
        <td colspan="3" class="text-left">
          {{ $store.state.userResults.avgSuitability }}
        </td>
      </tr>
      <tr>
        <td style="background-color: rgb(25,95,100, .1)" class="text-left">
          Area
        </td>
        <td colspan="3" class="text-left">
          {{ $store.state.userSiteMap.drawAcres }} sq meters
        </td>
      </tr>
      <tr>
        <td style="background-color: rgb(25,95,100, .1)" class="text-left">
          Site Corners <br />(decimal degrees)
        </td>
        <td class="text-left">
          Upper Left:<br />
          Upper Right:<br />
          Lower Right:<br />
          Lower Left:<br />
          Centroid:
        </td>
        <td colspan="2">
          {{ $store.state.userSiteMap.siteCornersDecimalDegrees.upperLeft }}
          <br />
          {{ $store.state.userSiteMap.siteCornersDecimalDegrees.upperRight }}
          <br />
          {{ $store.state.userSiteMap.siteCornersDecimalDegrees.lowerRight }}
          <br />
          {{ $store.state.userSiteMap.siteCornersDecimalDegrees.lowerLeft }}
          <br />
          {{ $store.state.userSiteMap.siteCornersDecimalDegrees.centroid }}
        </td>
      </tr>

      <tr>
        <td style="background-color: rgb(25,95,100, .1)" class="text-left"></td>
        <td class="text-left text-grey-7">(avg)</td>
        <td class="text-left text-grey-7">(min)</td>
        <td class="text-left text-grey-7">(max)</td>
      </tr>
      <tr>
        <td style="background-color: rgb(25,95,100, .1)" class="text-left">
          Batimetria (m)
        </td>
        <td class="text-left">
          {{
            new Intl.NumberFormat().format(
              $store.state.userResults.rasterStatistics.avg_depth
            )
          }}
        </td>
        <!-- depth is negative numbers so min is max and max is min.. -->
        <td class="text-left">
          {{
            new Intl.NumberFormat().format(
              $store.state.userResults.rasterStatistics.max_depth
            )
          }}
        </td>
        <td class="text-left">
          {{
            new Intl.NumberFormat().format(
              $store.state.userResults.rasterStatistics.min_depth
            )
          }}
        </td>
      </tr>
      <tr>
        <td style="background-color: rgb(25,95,100, .1)" class="text-left">
          Chl a (mg m-3)
        </td>
        <td class="text-left">
          {{
            new Intl.NumberFormat().format(
              $store.state.userResults.rasterStatistics.avg_chlor
            )
          }}
        </td>
        <td class="text-left">
          {{
            new Intl.NumberFormat().format(
              $store.state.userResults.rasterStatistics.min_chlor
            )
          }}
        </td>
        <td class="text-left">
          {{
            new Intl.NumberFormat().format(
              $store.state.userResults.rasterStatistics.max_chlor
            )
          }}
        </td>
      </tr>
      <tr>
        <td style="background-color: rgb(25,95,100, .1)" class="text-left">
          Corriente (m/s)
        </td>
        <td class="text-left">
          {{
            new Intl.NumberFormat().format(
              $store.state.userResults.rasterStatistics.avg_current
            )
          }}
        </td>
        <td class="text-left">
          {{
            new Intl.NumberFormat().format(
              $store.state.userResults.rasterStatistics.min_current
            )
          }}
        </td>
        <td class="text-left">
          {{
            new Intl.NumberFormat().format(
              $store.state.userResults.rasterStatistics.max_current
            )
          }}
        </td>
      </tr>
      <tr>
        <td style="background-color: rgb(25,95,100, .1)" class="text-left">
          Huracanes (mph)
        </td>
        <td class="text-left">
          {{
            new Intl.NumberFormat().format(
              $store.state.userResults.rasterStatistics.avg_wind
            )
          }}
        </td>
        <td class="text-left">
          {{
            new Intl.NumberFormat().format(
              $store.state.userResults.rasterStatistics.min_wind
            )
          }}
        </td>
        <td class="text-left">
          {{
            new Intl.NumberFormat().format(
              $store.state.userResults.rasterStatistics.max_wind
            )
          }}
        </td>
      </tr>
      <tr>
        <td style="background-color: rgb(25,95,100, .1)" class="text-left">
          Salinidad (ppt)
        </td>
        <td class="text-left">
          {{
            new Intl.NumberFormat().format(
              $store.state.userResults.rasterStatistics.avg_salinity
            )
          }}
        </td>
        <td class="text-left">
          {{
            new Intl.NumberFormat().format(
              $store.state.userResults.rasterStatistics.min_salinity
            )
          }}
        </td>
        <td class="text-left">
          {{
            new Intl.NumberFormat().format(
              $store.state.userResults.rasterStatistics.max_salinity
            )
          }}
        </td>
      </tr>
      <tr>
        <td style="background-color: rgb(25,95,100, .1)" class="text-left">
          Temperatura (C)
        </td>
        <td class="text-left">
          {{
            new Intl.NumberFormat().format(
              $store.state.userResults.rasterStatistics.avg_temp
            )
          }}
        </td>
        <td class="text-left">
          {{
            new Intl.NumberFormat().format(
              $store.state.userResults.rasterStatistics.min_temp
            )
          }}
        </td>
        <td class="text-left">
          {{
            new Intl.NumberFormat().format(
              $store.state.userResults.rasterStatistics.max_temp
            )
          }}
        </td>
      </tr>
      <tr>
        <td style="background-color: rgb(25,95,100, .1)" class="text-left">
          Altura de ola (m)
        </td>
        <td class="text-left">
          {{
            new Intl.NumberFormat().format(
              $store.state.userResults.rasterStatistics.avg_wheight
            )
          }}
        </td>
        <td class="text-left">
          {{
            new Intl.NumberFormat().format(
              $store.state.userResults.rasterStatistics.min_wheight
            )
          }}
        </td>
        <td class="text-left">
          {{
            new Intl.NumberFormat().format(
              $store.state.userResults.rasterStatistics.max_wheight
            )
          }}
        </td>
      </tr>
      <tr>
        <td style="background-color: rgb(25,95,100, .1)" class="text-left">
          Densidad de buques
        </td>
        <td class="text-left">
          {{
            new Intl.NumberFormat().format(
              $store.state.userResults.rasterStatistics.avg_ship
            )
          }}
        </td>
        <td class="text-left">
          {{
            new Intl.NumberFormat().format(
              $store.state.userResults.rasterStatistics.min_ship
            )
          }}
        </td>
        <td class="text-left">
          {{
            new Intl.NumberFormat().format(
              $store.state.userResults.rasterStatistics.max_ship
            )
          }}
        </td>
      </tr>
    </tbody>
  </q-markup-table>
</template>

<script>
export default {
  name: 'SiteSatistics',
  components: {},
  computed: {},
  mounted() {},
  methods: {},
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
