import { BaseMobilePage } from './base.mobile.page.js';

export class CheckoutMobilePage extends BaseMobilePage {
  constructor(driver) {
    super(driver);
    this.guestCountInput = '~guest_count_input';
    this.eventDateInput = '~event_date_input';
    this.confirmBookingButton = '~confirm_booking_button';
    this.successHeading = '~success_heading';
  }

  async fillEventDetails(guestCount, dateStr) {
    if (guestCount) await this.typeText(this.guestCountInput, guestCount.toString());
    if (dateStr) await this.typeText(this.eventDateInput, dateStr);
  }

  async confirmBooking() {
    await this.clickElement(this.confirmBookingButton);
  }
}
