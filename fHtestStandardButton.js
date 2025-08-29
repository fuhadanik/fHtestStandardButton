import { LightningElement, api } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import { encodeDefaultFieldValues } from 'lightning/pageReferenceUtils';

export default class FHtestStandardButton extends NavigationMixin(LightningElement) {
  // Parent context
  @api recordId;
  @api parentObjectApiName;        // e.g., 'SR_Ingredient__c'

  // Child config
  @api childObjectApiName;         // e.g., 'SR_Test_Standard_Connection__c'
  @api parentLookupFieldApiName;   // e.g., 'SR_Ingredient__c'
  @api recordTypeId;               // e.g., '012WB000000oC61YAE'

  // UI
  @api buttonLabel = 'New Child Record';
  @api alignment = 'left'; // left | center | right

  // Back-compat only (do not use)
  @api namePrefix;

  disabled = false;

  get buttonContainerClass() {
    if (this.alignment === 'center') return 'slds-text-align_center';
    if (this.alignment === 'right')  return 'slds-text-align_right';
    return 'slds-text-align_left';
  }

  connectedCallback() {
    // If any required config is missing, disable the button to prevent runtime errors
    const missing =
      !this.recordId ||
      !this.parentObjectApiName ||
      !this.childObjectApiName ||
      !this.parentLookupFieldApiName ||
      !this.recordTypeId;

    this.disabled = !!missing;
  }

  handleClick() {
    const defaults = encodeDefaultFieldValues({
      [this.parentLookupFieldApiName]: this.recordId
      // No Name: let auto-number generate it
    });

    this[NavigationMixin.Navigate]({
      type: 'standard__objectPage',
      attributes: { objectApiName: this.childObjectApiName, actionName: 'new' },
      state: {
        recordTypeId: this.recordTypeId,
        defaultFieldValues: defaults,
        navigationLocation: 'RELATED_LIST',
        backgroundContext: `/lightning/r/${this.parentObjectApiName}/${this.recordId}/view`
      }
    });
  }
}