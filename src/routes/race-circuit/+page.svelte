<script lang="ts">
  import { raceData, races, type AgeGroup, type Participant, getTotalPoints } from '$lib/data/race_circuit';

  // Track which age groups have their "Others" section expanded
  let expandedGroups: Record<string, boolean> = {};

  // Add new state to track expanded results
  let expandedResults: Record<string, boolean> = {};

  // Replace showModal with selectedParticipantKey
  let selectedParticipantKey: string | null = null;
  
  // Remove showModal variable and keep selectedParticipant
  let selectedParticipant: Participant | null = null;

  // Helper function to format age range
  function formatAgeRange(ageRange: AgeGroup['ageRange']): string {
    return ageRange.max === null 
      ? `${ageRange.min}+` 
      : `${ageRange.min}–${ageRange.max}`;
  }

  // Helper function to format category
  function formatCategory(group: AgeGroup): string {
    return `${group.gender} ${formatAgeRange(group.ageRange)}`;
  }


  // Helper functions to separate participants with and without results
  function getParticipantsWithResults(participants: Participant[]): Participant[] {
    return participants.filter(p => p.results.length > 0)
      .sort((a, b) => getTotalPoints(b) - getTotalPoints(a));
  }

  function getParticipantsWithoutResults(participants: Participant[]): Participant[] {
    return participants.filter(p => p.results.length === 0)
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  // New helper function to group age groups by age range
  function groupByAgeRange(raceData: AgeGroup[]): AgeGroup[][] {
    const groups: Record<string, AgeGroup[]> = {};
    
    raceData.forEach(group => {
      const ageKey = formatAgeRange(group.ageRange);
      if (!groups[ageKey]) {
        groups[ageKey] = [];
      }
      groups[ageKey].push(group);
    });

    return Object.values(groups);
  }

  // Helper function to generate unique key for each participant
  function getParticipantKey(participant: Participant, ageGroup: AgeGroup): string {
    return `${ageGroup.gender}-${ageGroup.ageRange.min}-${participant.name}`;
  }

  // Helper function to format race details
  function formatRaceDetail(result: { race: string, points: number, distance?: string | null }): string {
    let detail = `${result.race}`;
    if (result.distance) {
      detail += ` ${result.distance}`;
    }
    detail += `: ${result.points} ${result.points === 1 ? 'point' : 'points'}`;
    return detail;
  }

  // Add click outside handler
  function handleClickOutside(event: MouseEvent) {
    if (selectedParticipantKey) {
      const target = event.target as HTMLElement;
      if (!target.closest('.points-popup') && !target.closest('.points-button')) {
        selectedParticipantKey = null;
        selectedParticipant = null;
      }
    }
  }
</script>

<svelte:window on:click={handleClickOutside} />

<div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <h1 class="text-4xl font-bold text-gray-900 mb-8 text-center">Race Circuit</h1>
    <!-- Replace the race schedule section with this two-column version -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
      <div class="bg-white rounded-xl shadow-lg p-4">
        <h2 class="text-xl font-semibold text-gray-800 mb-4">Schedule</h2>
        <div class="grid grid-cols-[120px_1fr] gap-4">
          <div class="text-gray-600 space-y-1.5">
            {#each races as race}
              <div class="py-1.5">
                {new Date(race.date).toLocaleDateString('en-US', {month: 'short', day: 'numeric'})}
              </div>
            {/each}
          </div>
          <div class="space-y-1.5">
            {#each races as race}
              <div class="flex items-center gap-3 py-1.5 border-b border-gray-100 last:border-0 {race.org === '2nd Wind' ? 'bg-red-50' : ''}">
                <a 
                  href={race.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  class="font-medium hover:text-blue-600"
                >
                  {race.name}
                </a>
                {#if race.distances.length > 0}
                  <span class="text-gray-600">{race.distances.join(', ')}</span>
                {/if}
              </div>
            {/each}
          </div>
        </div>
      </div>
    </div>
    <h2 class="text-3xl font-bold text-gray-900 mb-8 text-center">Race Circuit Results</h2>

    <p class="text-center text-gray-600 mb-8">Click on point score to see detailed race results. If your name is <span class="italic text-gray-400">greyed out</span>, you must renew your membership before April 30, 2025 to remain eligible for the race circuit.</p>

    <!-- Desktop Grid Layout -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {#each groupByAgeRange(raceData) as ageGroups}
        <div class="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
          <h2 class="text-2xl font-semibold text-gray-800 mb-6 pb-2 border-b border-gray-200">{formatAgeRange(ageGroups[0].ageRange)}</h2>
          
          {#each ageGroups as ageGroup, index}
            {#if index > 0}
              <div class="my-6 border-t border-gray-200"></div>
            {/if}
            <h3 class="text-lg font-medium mb-3 {ageGroup.gender === 'Male' ? 'text-blue-600' : 'text-red-600'} flex items-center gap-2">
              <span>{ageGroup.gender}</span>
              <div class="flex-1 h-[0.5ex] bg-gradient-to-r {ageGroup.gender === 'Male' ? 'from-blue-100 to-transparent' : 'from-red-100 to-transparent'}"></div>
            </h3>
            
            <!-- Participants with results -->
            <div class="space-y-2 mb-6">
              {#each getParticipantsWithResults(ageGroup.participants) as participant}
                <div class="flex justify-between items-center py-2 border-b border-gray-100 hover:bg-gray-50 rounded transition-colors duration-200">
                  <span class="{participant.needsToRenew ? 'italic text-gray-400' : 'text-gray-700 font-medium'} flex items-center gap-2">
                    {participant.name}
                    {#if participant.needsToRenew}
                      <a 
                        href="https://runsignup.com/MyClubMemberships" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        class="text-xs px-2 py-0.5 rounded-full bg-red-50 text-red-600 hover:bg-red-100 transition-colors duration-200"
                      >
                        Renew
                      </a>
                    {/if}
                  </span>
                  <div class="text-right flex items-center gap-2 relative">
                    <button 
                      class="points-button px-3 py-1 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200 text-gray-700 font-medium"
                      on:click|stopPropagation={() => {
                        const key = getParticipantKey(participant, ageGroup);
                        selectedParticipantKey = selectedParticipantKey === key ? null : key;
                        selectedParticipant = selectedParticipantKey === key ? participant : null;
                      }}
                    >
                      {getTotalPoints(participant)} pt
                    </button>
                    
                    {#if selectedParticipantKey === getParticipantKey(participant, ageGroup) && selectedParticipant}
                      <div class="points-popup absolute right-0 top-8 w-64 bg-white shadow-lg rounded-lg p-3 z-10 border border-gray-200">
                        <div class="text-sm space-y-1">
                          {#each selectedParticipant.results as result}
                            <div class="py-1 border-b border-gray-100 last:border-0">
                              {formatRaceDetail(result)}
                            </div>
                          {/each}
                        </div>
                      </div>
                    {/if}
                  </div>
                </div>
              {/each}
            </div>

            <!-- Others section -->
            {#if getParticipantsWithoutResults(ageGroup.participants).length > 0}
              <div class="mt-4">
                <button
                  class="text-gray-600 hover:text-gray-800 text-sm font-medium flex items-center gap-2 px-3 py-1 rounded-full bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
                  on:click={() => expandedGroups[formatCategory(ageGroup)] = !expandedGroups[formatCategory(ageGroup)]}
                >
                  <span class="transform transition-transform {expandedGroups[formatCategory(ageGroup)] ? 'rotate-90' : ''} inline-block">
                    ▶
                  </span>
                  No results ({getParticipantsWithoutResults(ageGroup.participants).length})
                </button>

                {#if expandedGroups[formatCategory(ageGroup)]}
                  <div class="mt-3 space-y-2">
                    {#each getParticipantsWithoutResults(ageGroup.participants) as participant}
                      <div class="flex justify-between items-center py-2 px-3 border-b border-gray-100 hover:bg-gray-50 rounded transition-colors duration-200">
                        <span class="{participant.needsToRenew ? 'italic text-gray-400' : 'text-gray-500'} flex items-center gap-2">
                          {participant.name}
                          {#if participant.needsToRenew}
                            <a 
                              href="https://runsignup.com/MyClubMemberships" 
                              target="_blank" 
                              rel="noopener noreferrer"
                              class="text-xs px-2 py-0.5 rounded-full bg-red-50 text-red-600 hover:bg-red-100 transition-colors duration-200"
                            >
                              Renew
                            </a>
                          {/if}
                        </span>
                      </div>
                    {/each}
                  </div>
                {/if}
              </div>
            {/if}
          {/each}
        </div>
      {/each}
    </div>
  </div>
</div> 