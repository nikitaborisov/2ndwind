<script lang="ts">
  import { raceData, type AgeGroup, type Participant, getTotalPoints } from '$lib/data/race_circuit';

  // Track which age groups have their "Others" section expanded
  let expandedGroups: Record<string, boolean> = {};

  // Add new state to track expanded results
  let expandedResults: Record<string, boolean> = {};

  // Helper function to format age range
  function formatAgeRange(ageRange: AgeGroup['ageRange']): string {
    return ageRange.max === null 
      ? `${ageRange.min}+` 
      : `${ageRange.min}-${ageRange.max}`;
  }

  // Helper function to format category
  function formatCategory(group: AgeGroup): string {
    return `${group.gender} ${formatAgeRange(group.ageRange)}`;
  }

  // Helper function to format race results as a string
  function formatResults(participant: Participant): string {
    return participant.results
      .map(result => `${result.race}(${result.points})`)
      .join(' ');
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
</script>

<div class="min-h-screen bg-gray-100 py-6">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <h1 class="text-3xl font-bold text-gray-900 mb-8">Race Circuit Results</h1>
    
    <!-- Desktop Grid Layout -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {#each groupByAgeRange(raceData) as ageGroups}
        <div class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-xl font-semibold text-gray-800 mb-4">{formatAgeRange(ageGroups[0].ageRange)}</h2>
          
          {#each ageGroups as ageGroup}
            <h3 class="text-lg font-medium mb-2 {ageGroup.gender === 'Male' ? 'text-blue-600' : 'text-red-600'}">{ageGroup.gender}</h3>
            <!-- Participants with results -->
            <div class="space-y-2 mb-4">
              {#each getParticipantsWithResults(ageGroup.participants) as participant}
                <div class="flex justify-between items-center py-1 border-b border-gray-200">
                  <span class="text-gray-700">{participant.name}</span>
                  <div class="text-right">
                    <button 
                      class="text-gray-600 font-medium hover:text-gray-800"
                      on:click={() => expandedResults[getParticipantKey(participant, ageGroup)] = !expandedResults[getParticipantKey(participant, ageGroup)]}
                    >
                      {getTotalPoints(participant)} pts
                    </button>
                    {#if expandedResults[getParticipantKey(participant, ageGroup)]}
                      <span class="text-gray-500 text-sm ml-2">{formatResults(participant)}</span>
                    {/if}
                  </div>
                </div>
              {/each}
            </div>

            <!-- Others section -->
            {#if getParticipantsWithoutResults(ageGroup.participants).length > 0}
              <div class="mt-4">
                <button
                  class="text-gray-600 hover:text-gray-800 text-sm font-medium flex items-center gap-1"
                  on:click={() => expandedGroups[formatCategory(ageGroup)] = !expandedGroups[formatCategory(ageGroup)]}
                >
                  <span class="transform transition-transform {expandedGroups[formatCategory(ageGroup)] ? 'rotate-90' : ''} inline-block">
                    ▶
                  </span>
                  No results ({getParticipantsWithoutResults(ageGroup.participants).length})
                </button>

                {#if expandedGroups[formatCategory(ageGroup)]}
                  <div class="mt-2 space-y-2">
                    {#each getParticipantsWithoutResults(ageGroup.participants) as participant}
                      <div class="flex justify-between items-center py-1 border-b border-gray-200">
                        <span class="text-gray-500">{participant.name}</span>
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