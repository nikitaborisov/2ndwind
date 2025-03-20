<script lang="ts">
  import { raceData, races, type AgeGroup, type Participant, getTotalPoints } from '$lib/data/race_circuit';
  import '$lib/styles/colors.css';

  // Track which age groups have their "Others" section expanded
  let expandedGroups: Record<string, boolean> = {};

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
    <h1 class="text-4xl font-bold mb-8">Race Circuit</h1>

    <!-- Quick Navigation -->
    <div class="flex gap-4 mb-8">
      <a href="#rules" class="text-[var(--sw-text-secondary)] hover:text-[var(--sw-blue)] transition-colors duration-200 flex items-center gap-2">
        <span>📋</span> Rules
      </a>
      <a href="#results" class="text-[var(--sw-text-secondary)] hover:text-[var(--sw-blue)] transition-colors duration-200 flex items-center gap-2">
        <span>🏆</span> Results
      </a>
    </div>

    <!-- Schedule section -->
    <div class="bg-white rounded-xl shadow-lg p-4 mb-8">
      <h2>Schedule</h2>
      <p class="text-sm text-[var(--sw-text-secondary)] italic mb-4"><strong>Update:</strong> Mahoment 5K has been added</p>
      <div class="space-y-3">
        {#each races as race}
          <div class="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 py-2 border-b border-[var(--sw-border-light)] last:border-0 {race.org === '2nd Wind' ? 'bg-[var(--sw-blue-light)]' : ''}">
            <div class="text-[var(--sw-text-secondary)] text-sm sm:text-base min-w-[4.5rem] max-w-[5rem]">
              {new Date(race.date).toLocaleDateString('en-US', {month: 'short', day: 'numeric'})}
            </div>
            <div class="flex-1">
              <div class="flex items-center gap-2">
                <a 
                  href={race.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  class="font-medium hover:text-[var(--sw-blue)]"
                >
                  {race.name}
                </a>
                {#if race.distances.length > 0}
                  <span class="text-[var(--sw-text-secondary)]">{race.distances.join(', ')}</span>
                {/if}
                {#if race.org === '2nd Wind'}
                  <span class="text-xs px-1.5 py-0.5 rounded bg-[var(--sw-blue-light)] text-[var(--sw-blue)] font-medium flex items-center gap-1">
                    <img src="/images/2ndwind-logo.png" alt="SWRC" class="w-[1.2em] h-[1.2em]" />
                    <span>+2 pts</span>
                  </span>
                {:else if race.org === 'KRR'}
                  <span class="text-xs px-1.5 py-0.5 rounded text-[var(--sw-blue)] font-medium flex items-center gap-1">
                    <img src="/images/krr-logo.png" alt="KRR" class="w-[1.2em] h-[1.2em]" />
                  </span>
                {/if}
              </div>
            </div>
          </div>
        {/each}
      </div>
    </div>
    
    <h2 id="rules">Rules</h2>

    <div class="bg-[var(--sw-bg-primary)] rounded-xl shadow-lg p-6 space-y-6">
      <!-- Eligibility and Age Groups - Most important info first -->
      <div class="space-y-4">
        <h3>Eligibility & Age Groups</h3>
        <div class="space-y-4 text-[var(--sw-text-secondary)]">
          <p>
            To be eligible to participate, members must join/renew their membership by April 30 and include their birth date on the membership form. All eligible members will be automatically entered into the circuit standings.
          </p>
          <div class="bg-[var(--sw-bg-secondary)] p-4 rounded-lg">
            <p class="font-medium mb-2">Age Groups:</p>
            <p>Scoring is done within age groups (M/F):</p>
            <ul class="list-disc pl-6 mt-2">
              <li>19 and under</li>
              <li>20-29</li>
              <li>30-39</li>
              <li>40-49</li>
              <li>50-59</li>
              <li>60-69</li>
              <li>70+</li>
            </ul>
            <p class="mt-2">Your age group for this year's circuit is determined by your age on January 1; you stay in the same age group all year.</p>
          </div>
        </div>
      </div>

      <!-- Awards - Important goal for participants -->
      <div class="space-y-4">
        <h3>Awards</h3>
        <div class="bg-[var(--sw-bg-secondary)] p-4 rounded-lg text-[var(--sw-text-secondary)]">
          <p class="font-medium mb-2">To qualify for a circuit award:</p>
          <ul class="list-disc pl-6">
            <li>Finish in the top three of your age group</li>
            <li>Complete at least five circuit races</li>
          </ul>
          <p class="mt-2">Awardees will be recognized at the annual awards banquet.</p>
        </div>
      </div>

      <!-- Scoring System - Core mechanics -->
      <div class="space-y-4">
        <h3>Scoring System</h3>
        <div class="space-y-4 text-[var(--sw-text-secondary)]">

          <!-- Race Points -->
          <div class="bg-[var(--sw-bg-secondary)] p-4 rounded-lg">
            <p class="font-medium mb-2">Race Points</p>
            <p class="mb-2">Points are awarded based on your finish position within your age group:</p>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
              <div class="bg-[var(--sw-bg-primary)] p-3 rounded-lg">
                <p class="font-medium text-sm mb-2">10 or more age group participants:</p>
                <ul class="list-disc pl-6 text-sm space-y-1">
                  <li>1st place = 10 points</li>
                  <li>2nd place = 9 points</li>
                  <li>3rd place = 8 points</li>
                  <li>...</li>
                  <li>10th, 11th, 12th place... = 1 point</li>
                </ul>
              </div>

              <div class="bg-[var(--sw-bg-primary)] p-3 rounded-lg">
                <p class="font-medium text-sm mb-2">Fewer than 10 age group participants:</p>
                <p class="text-sm mb-2">Example with 6 participants:</p>
                <ul class="list-disc pl-6 text-sm space-y-1">
                  <li>1st place = 6 points</li>
                  <li>2nd place = 5 points</li>
                  <li>3rd place = 4 points</li>
                  <li>4th place = 3 points</li>
                  <li>5th place = 2 points</li>
                  <li>6th place = 1 point</li>
                </ul>
              </div>
  
            </div>
            <ul class="list-disc pl-6 space-y-1">
              <li>Everyone who participates gets at least 1 point</li>
              <li>If you are the only runner in your age group, you automatically earn 2 points</li>
            </ul>

          </div>
          <!-- Base Points -->
          <div class="bg-[var(--sw-bg-secondary)] p-4 rounded-lg">
          </div>

          <!-- Bonus Points -->
          <div class="bg-[var(--sw-bg-secondary)] p-4 rounded-lg">
            <p class="font-medium mb-2">Bonus Points</p>
            <ul class="list-disc pl-6 space-y-1">
              <li><span class="font-medium">SWRC Events</span> (+2 points):</li>
              <ul class="list-disc pl-6 mt-1 text-sm">
                <li>Buffalo Trace Trail Race</li>
                <li>Countryside 10K</li>
                <li>Allerton Park Trail Run</li>
                <li>Clinton Trail Ultras</li>
              </ul>
              <li class="mt-2"><span class="font-medium">Illinois Full Marathon</span> (+5 points for 26.2 mi)</li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Event Considerations - Important details -->
      <div class="space-y-4">
        <h3>Event Considerations</h3>
        <div class="bg-[var(--sw-bg-secondary)] p-4 rounded-lg text-[var(--sw-text-secondary)]">
          <ul class="list-disc pl-6 space-y-2">
            <li>If an event has in-person and virtual options, only the in-person results will be taken into account</li>
            <li>Virtual results will only be taken into account if the entire event becomes virtual</li>
            <li>If the event has more than one distance, you may participate in all circuit eligible distances</li>
          </ul>
        </div>
      </div>

      <!-- Contact Information -->
      <div class="space-y-4">
        <h3>Contact</h3>
        <div class="bg-[var(--sw-bg-secondary)] p-4 rounded-lg text-[var(--sw-text-secondary)]">
          <p>Your race circuit coordinator is Juan Salas (racecircuit@secondwindrunningclub.org).</p>
          <p>Feel free to email with questions/concerns/corrections.</p>
          <p class="mt-2 italic">The race circuit coordinator reserves the right to alter these rules when necessary.</p>
        </div>
      </div>
    </div>

    <h2 id="results">Race Circuit Results</h2>

    <p class="text-[var(--sw-text-secondary)] mb-8">Click on point score to see detailed race results. If your name is <span class="italic text-[var(--sw-text-muted)]">greyed out</span>, you must renew your membership before April 30, 2025 to remain eligible for the race circuit.</p>

    <!-- Desktop Grid Layout -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {#each groupByAgeRange(raceData) as ageGroups}
        <div class="bg-[var(--sw-bg-primary)] rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
          <h3 class="ag">{formatAgeRange(ageGroups[0].ageRange)}</h3>
          
          {#each ageGroups as ageGroup, index}
            {#if index > 0}
              <div class="my-6 border-t border-[var(--sw-border)]"></div>
            {/if}
            <h4 class="{ageGroup.gender === 'Male' ? 'male' : 'female'} flex items-center gap-2">
              <span>{ageGroup.gender}</span>
              <div class="gradient-line flex-1 h-[0.5ex]"></div>
            </h4>
            
            <!-- Participants with results -->
            <div class="space-y-2 mb-6">
              {#each getParticipantsWithResults(ageGroup.participants) as participant}
                <div class="flex justify-between items-center py-2 border-b border-[var(--sw-border-light)] hover:bg-[var(--sw-bg-hover)] rounded transition-colors duration-200">
                  <span class="{participant.needsToRenew ? 'italic text-[var(--sw-text-muted)]' : 'text-[var(--sw-text-primary)] font-medium'} flex items-center gap-2">
                    {participant.name}
                    {#if participant.needsToRenew}
                      <a 
                        href="https://runsignup.com/MyClubMemberships" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        class="text-xs px-2 py-0.5 rounded-full bg-[var(--sw-blue-light)] text-[var(--sw-blue)] hover:bg-[var(--sw-blue-hover)] transition-colors duration-200"
                      >
                        Renew
                      </a>
                    {/if}
                  </span>
                  <div class="text-right flex items-center gap-2 relative">
                    <button 
                      class="points-button px-3 py-1 rounded-full bg-[var(--sw-bg-hover)] hover:bg-[var(--sw-bg-secondary)] transition-colors duration-200 text-[var(--sw-text-primary)] font-medium"
                      on:click|stopPropagation={() => {
                        const key = getParticipantKey(participant, ageGroup);
                        selectedParticipantKey = selectedParticipantKey === key ? null : key;
                        selectedParticipant = selectedParticipantKey === key ? participant : null;
                      }}
                    >
                      {getTotalPoints(participant)} pt
                    </button>
                    
                    {#if selectedParticipantKey === getParticipantKey(participant, ageGroup) && selectedParticipant}
                      <div class="points-popup absolute right-0 top-8 w-64 bg-[var(--sw-bg-primary)] shadow-lg rounded-lg p-3 z-10 border border-[var(--sw-border)]">
                        <div class="text-sm space-y-1">
                          {#each selectedParticipant.results as result}
                            <div class="py-1 border-b border-[var(--sw-border-light)] last:border-0">
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
                  class="text-[var(--sw-text-secondary)] hover:text-[var(--sw-text-primary)] text-sm font-medium flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--sw-bg-secondary)] hover:bg-[var(--sw-bg-hover)] transition-colors duration-200"
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
                      <div class="flex justify-between items-center py-2 px-3 border-b border-[var(--sw-border-light)] hover:bg-[var(--sw-bg-hover)] rounded transition-colors duration-200">
                        <span class="{participant.needsToRenew ? 'italic text-[var(--sw-text-muted)]' : 'text-[var(--sw-text-secondary)]'} flex items-center gap-2">
                          {participant.name}
                          {#if participant.needsToRenew}
                            <a 
                              href="https://runsignup.com/MyClubMemberships" 
                              target="_blank" 
                              rel="noopener noreferrer"
                              class="text-xs px-2 py-0.5 rounded-full bg-[var(--sw-blue-light)] text-[var(--sw-blue)] hover:bg-[var(--sw-blue-hover)] transition-colors duration-200"
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