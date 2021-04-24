import React from 'react';
import IconSettings from '@salesforce/design-system-react/components/icon-settings';
import actionSprite from '@salesforce-ux/design-system/assets/icons/action-sprite/svg/symbols.svg';
import customSprite from '@salesforce-ux/design-system/assets/icons/custom-sprite/svg/symbols.svg';
import standardSprite from '@salesforce-ux/design-system/assets/icons/standard-sprite/svg/symbols.svg';
import utilitySprite from '@salesforce-ux/design-system/assets/icons/utility-sprite/svg/symbols.svg';
import Icon from '@salesforce/design-system-react/components/icon'; 

export class SteedosIcon extends React.Component {
	render() {
		let { category="standard", name, size="small", assistiveText  } = this.props;
		return (
			<IconSettings actionSprite={actionSprite} standardSprite={standardSprite} customSprite={customSprite} utilitySprite={utilitySprite}>
				<Icon
                    assistiveText={assistiveText}
                    category={category}
                    name={name}
                    size={size}
                />
			</IconSettings>
		);
	}
}
