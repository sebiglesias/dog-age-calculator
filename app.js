// Dog & Cat Age in Human Years & Food Estimator
document.addEventListener('DOMContentLoaded', () => {
  const $ = s => document.querySelector(s);
  const $$ = s => document.querySelectorAll(s);

  let currentPet = 'dog';

  function calculate() {
    const years = parseFloat($('#petAgeYears').value) || 0;
    const months = parseFloat($('#petAgeMonths').value) || 0;
    const totalAge = years + (months / 12);
    const weightLbs = parseFloat($('#petWeightLbs').value) || 45;
    const weightKg = weightLbs * 0.453592;
    const activity = $('#activityLevelSelect').value;
    const bagLbs = parseFloat($('#kibbleBagLbs').value) || 30;
    const breedSize = $('#breedSizeSelect').value;

    let humanAge = 0;

    if (currentPet === 'cat') {
      if (totalAge <= 1) {
        humanAge = totalAge * 15;
      } else if (totalAge <= 2) {
        humanAge = 15 + (totalAge - 1) * 9;
      } else {
        humanAge = 24 + (totalAge - 2) * 4;
      }
    } else {
      // Scientific AVMA Dog Age Formula by Breed Weight
      if (totalAge <= 1) {
        humanAge = totalAge * 15;
      } else if (totalAge <= 2) {
        humanAge = 15 + (totalAge - 1) * 9;
      } else {
        const extraYears = totalAge - 2;
        if (breedSize === 'small') {
          humanAge = 24 + extraYears * 4;
        } else if (breedSize === 'medium') {
          humanAge = 24 + extraYears * 5;
        } else if (breedSize === 'large') {
          humanAge = 24 + extraYears * 6;
        } else {
          // Giant breed
          humanAge = 22 + extraYears * 7.5;
        }
      }
    }

    const roundedHumanAge = Math.max(1, Math.round(humanAge));

    // Life Stage determination
    let stageTitle = '';
    let vetCheck = '';

    if (totalAge < 1) {
      stageTitle = currentPet === 'dog' ? 'Puppy (Growth Stage)' : 'Kitten (Rapid Development)';
      vetCheck = 'Initial puppy vaccine boosters (DHPP, Rabies), deworming, and microchipping.';
    } else if (roundedHumanAge <= 35) {
      stageTitle = 'Young Adult (Prime Health)';
      vetCheck = 'Annual wellness exam, heartworm/flea prevention, and dental cleaning assessment.';
    } else if (roundedHumanAge <= 55) {
      stageTitle = 'Mature Adult (Maintenance)';
      vetCheck = 'Bi-annual checkups, weight monitoring, joint support supplements (Glucosamine).';
    } else if (roundedHumanAge <= 75) {
      stageTitle = 'Senior (Golden Years)';
      vetCheck = 'Senior blood chemistry panel, kidney/liver screening, arthritis management.';
    } else {
      stageTitle = 'Geriatric (Super Senior)';
      vetCheck = 'Frequent comfort monitoring, gentle mobility walks, specialized senior cognitive care.';
    }

    // Food Portion calculation (approx 20 to 30 kcal/lb of bodyweight)
    let mult = 1.0;
    if (activity === 'low') mult = 0.85;
    if (activity === 'high') mult = 1.25;

    // Daily grams (~2% to 2.5% of body weight for average adult)
    const dailyGrams = Math.round(weightKg * 22 * mult);
    // Standard kibble is ~105g per US 8oz measuring cup
    const dailyCups = (dailyGrams / 105).toFixed(1);

    // Bag duration
    const bagGrams = bagLbs * 453.592;
    const daysLast = Math.round(bagGrams / dailyGrams);

    return {
      roundedHumanAge,
      stageTitle,
      vetCheck,
      dailyCups,
      dailyGrams,
      daysLast
    };
  }

  function render() {
    const res = calculate();

    $('#resHumanYears').textContent = res.roundedHumanAge;
    $('#resCups').textContent = res.dailyCups;
    $('#resDailyGrams').textContent = `~${res.dailyGrams} grams / day`;
    $('#resLifeStageBadge').textContent = res.stageTitle;
    $('#resVetCheck').textContent = res.vetCheck;
    $('#resBagDuration').textContent = `~${res.daysLast} days`;
  }

  // Pet Switcher
  $$('.pet-tab').forEach(tab => {
    tab.onclick = () => {
      $$('.pet-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      currentPet = tab.dataset.pet;

      if (currentPet === 'cat') {
        $('#groupBreedSize').style.display = 'none';
        $('#petWeightLbs').value = '10';
      } else {
        $('#groupBreedSize').style.display = 'block';
        $('#petWeightLbs').value = '45';
      }
      render();
    };
  });

  // Inputs binding
  ['#petAgeYears', '#petAgeMonths', '#breedSizeSelect', '#petWeightLbs', '#activityLevelSelect', '#kibbleBagLbs'].forEach(sel => {
    const el = $(sel);
    if (el) el.oninput = render;
  });

  render();
});
