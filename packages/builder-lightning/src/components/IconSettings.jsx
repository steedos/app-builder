import React from 'react';
import IconSettings from '@salesforce/design-system-react/components/icon-settings';
import actionSprite from '@salesforce-ux/design-system/assets/icons/action-sprite/svg/symbols.svg';
import customSprite from '@salesforce-ux/design-system/assets/icons/custom-sprite/svg/symbols.svg';
import standardSprite from '@salesforce-ux/design-system/assets/icons/standard-sprite/svg/symbols.svg';
import utilitySprite from '@salesforce-ux/design-system/assets/icons/utility-sprite/svg/symbols.svg';
import Icon from '@salesforce/design-system-react/components/icon'; 

export class SteedosIconSettings extends React.Component {
	render() {
		let { children } = this.props;
		return (
			<IconSettings actionSprite={actionSprite} standardSprite={standardSprite} customSprite={customSprite} utilitySprite={utilitySprite}>
				{children}
			</IconSettings>
		);
	}
}
