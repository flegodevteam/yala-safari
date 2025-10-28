// utils/pricingCalculator.js
class PricingCalculator {
  /**
   * Calculate total booking price
   */
  async calculatePricing(bookingData, safari) {
    const breakdown = {
      safariBase: 0,
      entranceFees: 0,
      jeepRental: 0,
      meals: 0,
      guide: 0,
      pickup: 0,
      taxes: 0,
      discounts: 0
    };

    // Calculate entrance fees
    breakdown.entranceFees = this.calculateEntranceFees(
      bookingData.participants,
      safari.pricing.entranceFees
    );

    // Calculate jeep rental
    if (bookingData.bookingType === 'private') {
      breakdown.jeepRental = await this.calculateJeepRental(
        bookingData.jeepType,
        safari.type
      );
    } else {
      breakdown.jeepRental = this.calculateSharedJeepCost(
        bookingData.participants.totalCount
      );
    }

    // Calculate meal costs
    if (bookingData.extras?.meals) {
      breakdown.meals = this.calculateMealCost(bookingData.extras.meals);
    }

    // Calculate guide cost
    if (bookingData.extras?.guide && bookingData.extras.guide !== 'driver-only') {
      breakdown.guide = this.calculateGuideCost(bookingData.extras.guide);
    }

    // Calculate pickup cost
    if (bookingData.pickup?.required) {
      breakdown.pickup = await this.calculatePickupCost(
        bookingData.pickup.location
      );
    }

    // Apply discounts
    breakdown.discounts = this.calculateDiscounts(
      bookingData,
      breakdown
    );

    // Calculate taxes
    const subtotal = Object.values(breakdown).reduce((sum, val) => 
      sum + (val > 0 ? val : 0), 0
    ) - breakdown.discounts;
    
    breakdown.taxes = subtotal * 0.15; // 15% tax

    const total = subtotal + breakdown.taxes;

    return {
      breakdown,
      subtotal,
      total,
      currency: 'USD'
    };
  }

  /**
   * Calculate entrance fees
   */
  calculateEntranceFees(participants, feeStructure) {
    let total = 0;
    
    if (participants.adults.foreign > 0) {
      total += participants.adults.foreign * feeStructure.foreign.adult;
    }
    if (participants.children.foreign > 0) {
      total += participants.children.foreign * feeStructure.foreign.child;
    }
    if (participants.adults.local > 0) {
      total += participants.adults.local * feeStructure.local.adult;
    }
    if (participants.children.local > 0) {
      total += participants.children.local * feeStructure.local.child;
    }

    return total;
  }

  /**
   * Calculate jeep rental cost
   */
  async calculateJeepRental(jeepType, safariType) {
    const jeepPricing = {
      basic: { morning: 50, afternoon: 50, extended: 70, fullday: 100 },
      luxury: { morning: 70, afternoon: 70, extended: 90, fullday: 120 },
      'super-luxury': { morning: 100, afternoon: 100, extended: 120, fullday: 150 }
    };

    return jeepPricing[jeepType]?.[safariType] || 0;
  }

  /**
   * Calculate shared jeep cost
   */
  calculateSharedJeepCost(numberOfSeats) {
    const seatPricing = {
      1: 10,
      2: 8,
      3: 7,
      4: 5,
      5: 5,
      6: 5,
      7: 5
    };

    return (seatPricing[numberOfSeats] || 5) * numberOfSeats;
  }

  /**
   * Calculate meal cost
   */
  calculateMealCost(meals) {
    let total = 0;
    const mealPrices = {
      breakfast: 5,
      lunch: 6
    };

    if (meals.breakfast?.included) {
      const count = (meals.breakfast.vegetarian || 0) + 
                   (meals.breakfast.nonVegetarian || 0);
      total += count * mealPrices.breakfast;
    }

    if (meals.lunch?.included) {
      const count = (meals.lunch.vegetarian || 0) + 
                   (meals.lunch.nonVegetarian || 0);
      total += count * mealPrices.lunch;
    }

    return total;
  }

  /**
   * Calculate guide cost
   */
  calculateGuideCost(guideType) {
    const guidePrices = {
      'driver-guide': 10,
      'separate-guide': 15
    };

    return guidePrices[guideType] || 0;
  }

  /**
   * Calculate pickup cost
   */
  async calculatePickupCost(location) {
    // This would calculate based on distance
    // For now, using a fixed rate
    return 20;
  }

  /**
   * Calculate discounts
   */
  calculateDiscounts(bookingData, breakdown) {
    let discount = 0;

    // Group discount (10% for 5+ people)
    if (bookingData.participants.totalCount >= 5) {
      discount += (breakdown.jeepRental + breakdown.entranceFees) * 0.1;
    }

    // Early booking discount (5% for bookings made 30+ days in advance)
    const daysInAdvance = Math.floor(
      (new Date(bookingData.date) - new Date()) / (1000 * 60 * 60 * 24)
    );
    if (daysInAdvance >= 30) {
      discount += (breakdown.jeepRental + breakdown.entranceFees) * 0.05;
    }

    return discount;
  }
}

export const calculatePricing = new PricingCalculator().calculatePricing;