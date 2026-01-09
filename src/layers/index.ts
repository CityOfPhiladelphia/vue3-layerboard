/**
 * Layer Index
 *
 * Auto-generated index that exports all layer configs.
 * Generated on 2026-01-09
 *
 * NOTE: This file manually imports all 114 layer files. If we were to continue
 * using static mode long-term, consider using Vite's `import.meta.glob()` for
 * automatic file discovery instead:
 *
 * ```typescript
 * const modules = import.meta.glob('./*.ts', { eager: true });
 * export const layers = Object.entries(modules)
 *   .filter(([path]) => !path.includes('index.ts') && !path.includes('types.ts'))
 *   .map(([_, module]: [string, any]) => module.default || Object.values(module)[0]);
 * ```
 *
 * However, this may become obsolete if the dynamic mode approach is adopted,
 * which loads and transforms layer configs at runtime instead.
 */

import { airManagementLatestCoreSiteReadings } from "./air-management-latest-core-site-readings";
import { athleticFieldsTracksAndCourts } from "./athletic-fields-tracks-and-courts";
import { bigBellyWastebaskets } from "./big-belly-wastebaskets";
import { bikeNetwork } from "./bike-network";
import { businessImprovementDistricts } from "./business-improvement-districts";
import { businessLicensesFood } from "./business-licenses-food";
import { businessLicenses } from "./business-licenses";
import { businessPermitsSigns } from "./business-permits-signs";
import { businessViolationsUnderConstruction } from "./business-violations-under-construction";
import { cIFireViolationsUnderConstruction } from "./c-i-fire-violations-under-construction";
import { censusBlockGroups2020 } from "./census-block-groups-2020";
import { censusTracts2020 } from "./census-tracts-2020";
import { cityLimits } from "./city-limits";
import { combinedSewerServiceArea } from "./combined-sewer-service-area";
import { commercialCorridors } from "./commercial-corridors";
import { communityCompostNetworkSites } from "./community-compost-network-sites";
import { completeStreetTypes } from "./complete-street-types";
import { condomDistributionSites } from "./condom-distribution-sites";
import { constructionPermitsBuilding } from "./construction-permits-building";
import { constructionPermitsElectrical } from "./construction-permits-electrical";
import { constructionPermitsMechanical } from "./construction-permits-mechanical";
import { constructionPermitsPlumbing } from "./construction-permits-plumbing";
import { constructionPermitsZoning } from "./construction-permits-zoning";
import { constructionViolationsUnderConstruction } from "./construction-violations-under-construction";
import { councilDistricts2024 } from "./council-districts-2024";
import { crimeIncidentsLast30Days } from "./crime-incidents-last-30-days";
import { currentlyActiveLaneClosurePermits } from "./currently-active-lane-closure-permits";
import { dhcdChoiceNeighborhoods } from "./dhcd-choice-neighborhoods";
import { elementarySchoolCatchments } from "./elementary-school-catchments";
import { farmersMarkets } from "./farmers-markets";
import { fema100YearFloodplain } from "./fema-100-year-floodplain";
import { fema500YearFloodplain } from "./fema-500-year-floodplain";
import { fireStations } from "./fire-stations";
import { freeLibraries } from "./free-libraries";
import { futureLaneClosurePermits } from "./future-lane-closure-permits";
import { greenStormwaterInfrastructureProjectsPublic } from "./green-stormwater-infrastructure-projects-public";
import { healthCentersCityOwned } from "./health-centers-city-owned";
import { healthCentersNonCityOwned } from "./health-centers-non-city-owned";
import { healthyStartMaternalChildAndFamilyCenters } from "./healthy-start-maternal-child-and-family-centers";
import { heatExposureByCensusTract } from "./heat-exposure-by-census-tract";
import { highSchoolCatchments } from "./high-school-catchments";
import { hospitals } from "./hospitals";
import { iceRinks } from "./ice-rinks";
import { landUse } from "./land-use";
import { leafCollectionAreas } from "./leaf-collection-areas";
import { leafDropoffSites } from "./leaf-dropoff-sites";
import { licensesAndInspectionsBoardOfBuildingStandardsAppeals } from "./licenses-and-inspections-board-of-building-standards-appeals";
import { licensesAndInspectionsCaseInvestigations } from "./licenses-and-inspections-case-investigations";
import { licensesAndInspectionsCityDemolitions } from "./licenses-and-inspections-city-demolitions";
import { licensesAndInspectionsCleanSeal } from "./licenses-and-inspections-clean-seal";
import { licensesAndInspectionsComplaints } from "./licenses-and-inspections-complaints";
import { licensesAndInspectionsImminentlyDangerousViolations } from "./licenses-and-inspections-imminently-dangerous-violations";
import { licensesAndInspectionsLIReviewBoardAppeals } from "./licenses-and-inspections-l-i-review-board-appeals";
import { licensesAndInspectionsPermitsAll } from "./licenses-and-inspections-permits-all";
import { licensesAndInspectionsPrivateDemolitions } from "./licenses-and-inspections-private-demolitions";
import { licensesAndInspectionsUnsafeViolations } from "./licenses-and-inspections-unsafe-violations";
import { licensesAndInspectionsViolationsAllUnderConstruction } from "./licenses-and-inspections-violations-all-under-construction";
import { middleSchoolCatchments } from "./middle-school-catchments";
import { neighborhoodAdvisoryCommittees } from "./neighborhood-advisory-committees";
import { neighborhoodEnergyCenters } from "./neighborhood-energy-centers";
import { noThruTrucksStreets } from "./no-thru-trucks-streets";
import { olderAdultCommunityCenters } from "./older-adult-community-centers";
import { parksAndRecreationBuildingsStructures } from "./parks-and-recreation-buildings-structures";
import { parksAndRecreationProgramSites } from "./parks-and-recreation-program-sites";
import { parksAndRecreationProperties } from "./parks-and-recreation-properties";
import { philadelphiaRegisterOfHistoricDistricts } from "./philadelphia-register-of-historic-districts";
import { philadelphiaRegisterOfHistoricPlaces } from "./philadelphia-register-of-historic-places";
import { phsLandcareParcels } from "./phs-landcare-parcels";
import { planningDistricts } from "./planning-districts";
import { policeDistricts } from "./police-districts";
import { policeServiceAreas } from "./police-service-areas";
import { policeStations } from "./police-stations";
import { politicalWardDivisions } from "./political-ward-divisions";
import { politicalWards } from "./political-wards";
import { pollingPlaces } from "./polling-places";
import { pprTreeInventory } from "./ppr-tree-inventory";
import { propertyMaintenanceViolationsUnderConstruction } from "./property-maintenance-violations-under-construction";
import { protectedSteepSlopeAreas } from "./protected-steep-slope-areas";
import { publicPlaygrounds } from "./public-playgrounds";
import { publicSpraygrounds } from "./public-spraygrounds";
import { publicSwimmingPools } from "./public-swimming-pools";
import { raincheckInstallationSites } from "./raincheck-installation-sites";
import { rebuildSites } from "./rebuild-sites";
import { recreationCenters } from "./recreation-centers";
import { recyclingDiversionRate } from "./recycling-diversion-rate";
import { regionalWatersheds } from "./regional-watersheds";
import { registeredCommunityGardens } from "./registered-community-gardens";
import { registeredCommunityOrganizationsRco } from "./registered-community-organizations-rco";
import { rentalLicenseViolationsUnderConstruction } from "./rental-license-violations-under-construction";
import { rentalLicenses } from "./rental-licenses";
import { rubbishAndRecyclingCollectionSchedule } from "./rubbish-and-recycling-collection-schedule";
import { sanitationConvenienceCenters } from "./sanitation-convenience-centers";
import { schools } from "./schools";
import { stateHouseDistricts2022 } from "./state-house-districts-2022";
import { tobaccoRetailerDensityCaps } from "./tobacco-retailer-density-caps";
import { trafficCalmingDevices } from "./traffic-calming-devices";
import { usCongressionalDistricts } from "./us-congressional-districts";
import { vacancyLicenses } from "./vacancy-licenses";
import { vacancyViolationsUnderConstruction } from "./vacancy-violations-under-construction";
import { vacantBuildingIndicators } from "./vacant-building-indicators";
import { vacantLandIndicators } from "./vacant-land-indicators";
import { vendingFoodEstablishments } from "./vending-food-establishments";
import { vendingProhibitedAreas } from "./vending-prohibited-areas";
import { vendingProhibitedStreets } from "./vending-prohibited-streets";
import { vendingSpecialDistricts } from "./vending-special-districts";
import { visionZeroHighInjuryNetwork2020 } from "./vision-zero-high-injury-network-2020";
import { vitalStatisticsPopulationByCensusTract } from "./vital-statistics-population-by-census-tract";
import { vitalStatisticsPopulationByDistrict } from "./vital-statistics-population-by-district";
import { westPhiladelphiaPromiseZone } from "./west-philadelphia-promise-zone";
import { wicOffices } from "./wic-offices";
import { wireWastebaskets } from "./wire-wastebaskets";
import { zipcodes } from "./zipcodes";
import { zoningAndPlanningZoningBoardOfAdjustmentAppeals } from "./zoning-and-planning-zoning-board-of-adjustment-appeals";
import { zoningBaseDistricts } from "./zoning-base-districts";
import { zoningOverlays } from "./zoning-overlays";

// Export as array for easy iteration
export const layers = [
  airManagementLatestCoreSiteReadings,
  athleticFieldsTracksAndCourts,
  bigBellyWastebaskets,
  bikeNetwork,
  businessImprovementDistricts,
  businessLicensesFood,
  businessLicenses,
  businessPermitsSigns,
  businessViolationsUnderConstruction,
  cIFireViolationsUnderConstruction,
  censusBlockGroups2020,
  censusTracts2020,
  cityLimits,
  combinedSewerServiceArea,
  commercialCorridors,
  communityCompostNetworkSites,
  completeStreetTypes,
  condomDistributionSites,
  constructionPermitsBuilding,
  constructionPermitsElectrical,
  constructionPermitsMechanical,
  constructionPermitsPlumbing,
  constructionPermitsZoning,
  constructionViolationsUnderConstruction,
  councilDistricts2024,
  crimeIncidentsLast30Days,
  currentlyActiveLaneClosurePermits,
  dhcdChoiceNeighborhoods,
  elementarySchoolCatchments,
  farmersMarkets,
  fema100YearFloodplain,
  fema500YearFloodplain,
  fireStations,
  freeLibraries,
  futureLaneClosurePermits,
  greenStormwaterInfrastructureProjectsPublic,
  healthCentersCityOwned,
  healthCentersNonCityOwned,
  healthyStartMaternalChildAndFamilyCenters,
  heatExposureByCensusTract,
  highSchoolCatchments,
  hospitals,
  iceRinks,
  landUse,
  leafCollectionAreas,
  leafDropoffSites,
  licensesAndInspectionsBoardOfBuildingStandardsAppeals,
  licensesAndInspectionsCaseInvestigations,
  licensesAndInspectionsCityDemolitions,
  licensesAndInspectionsCleanSeal,
  licensesAndInspectionsComplaints,
  licensesAndInspectionsImminentlyDangerousViolations,
  licensesAndInspectionsLIReviewBoardAppeals,
  licensesAndInspectionsPermitsAll,
  licensesAndInspectionsPrivateDemolitions,
  licensesAndInspectionsUnsafeViolations,
  licensesAndInspectionsViolationsAllUnderConstruction,
  middleSchoolCatchments,
  neighborhoodAdvisoryCommittees,
  neighborhoodEnergyCenters,
  noThruTrucksStreets,
  olderAdultCommunityCenters,
  parksAndRecreationBuildingsStructures,
  parksAndRecreationProgramSites,
  parksAndRecreationProperties,
  philadelphiaRegisterOfHistoricDistricts,
  philadelphiaRegisterOfHistoricPlaces,
  phsLandcareParcels,
  planningDistricts,
  policeDistricts,
  policeServiceAreas,
  policeStations,
  politicalWardDivisions,
  politicalWards,
  pollingPlaces,
  pprTreeInventory,
  propertyMaintenanceViolationsUnderConstruction,
  protectedSteepSlopeAreas,
  publicPlaygrounds,
  publicSpraygrounds,
  publicSwimmingPools,
  raincheckInstallationSites,
  rebuildSites,
  recreationCenters,
  recyclingDiversionRate,
  regionalWatersheds,
  registeredCommunityGardens,
  registeredCommunityOrganizationsRco,
  rentalLicenseViolationsUnderConstruction,
  rentalLicenses,
  rubbishAndRecyclingCollectionSchedule,
  sanitationConvenienceCenters,
  schools,
  stateHouseDistricts2022,
  tobaccoRetailerDensityCaps,
  trafficCalmingDevices,
  usCongressionalDistricts,
  vacancyLicenses,
  vacancyViolationsUnderConstruction,
  vacantBuildingIndicators,
  vacantLandIndicators,
  vendingFoodEstablishments,
  vendingProhibitedAreas,
  vendingProhibitedStreets,
  vendingSpecialDistricts,
  visionZeroHighInjuryNetwork2020,
  vitalStatisticsPopulationByCensusTract,
  vitalStatisticsPopulationByDistrict,
  westPhiladelphiaPromiseZone,
  wicOffices,
  wireWastebaskets,
  zipcodes,
  zoningAndPlanningZoningBoardOfAdjustmentAppeals,
  zoningBaseDistricts,
  zoningOverlays,
];
