import React from 'react';

import AppLauncher from '@salesforce/design-system-react/components/app-launcher'; 
import AppLauncherLink from '@salesforce/design-system-react/components/app-launcher/link';
import AppLauncherTile from '@salesforce/design-system-react/components/app-launcher/tile';
import AppLauncherExpandableSection from '@salesforce/design-system-react/components/app-launcher/expandable-section';

import GlobalNavigationBar from '@salesforce/design-system-react/components/global-navigation-bar';
import GlobalNavigationBarRegion from '@salesforce/design-system-react/components/global-navigation-bar/region';

import Button from '@salesforce/design-system-react/components/button';
import Search from '@salesforce/design-system-react/components/input/search';
import IconSettings from '@salesforce/design-system-react/components/icon-settings';

function getTabs(apps){
	let tabs = [];
	_.each(apps, function(app){
		tabs = tabs.concat(app.children)
	})
	return _.unionBy(tabs, "id");;
}

export class SteedosAppLauncher extends React.Component {
	static displayName = 'Steedos App Launcher';
	state = {
		search: '',
		open: false,
	};

	onSearch = (event) => {
		this.setState({ search: event.target.value });
	};
	triggerOnClick = ()=> {
		this.setState({open: !this.state.open})
	}
	onClick=(value, e)=>{
		if(this.props.history){
			this.props.history.push(value.path);
		}
		this.setState({open: false})
	}
	render() {
		const search = (
			<Search
				onChange={(event) => {
					console.log('Search term:', event.target.value);
					this.onSearch(event);
				}}
				placeholder="搜索应用程序或项目..."
				assistiveText={{ label: '搜索应用程序或项目...' }}
			/>
		);
		const headerButton = <Button label="App Exchange" />;
		let { currentApp, apps  } = this.props;
		if(!currentApp){
			currentApp = {}
		}
		if(!apps){
			apps = []
		}
		const tabs = getTabs(apps);
		return (
			<IconSettings iconPath="/assets/icons">
				<GlobalNavigationBar>
					<GlobalNavigationBarRegion region="primary">
						<AppLauncher
							title="应用程序启动器"
							triggerName={currentApp.name}
							search={search}
							// modalHeaderButton={headerButton}
							isOpen={this.state.open}
							triggerOnClick={this.triggerOnClick}
						>
							<AppLauncherExpandableSection title="所有应用程序">
								{apps?.map((app, i) => (
									<AppLauncherTile
										description={app.description}
										iconText={app.icon}
										search={this.state.search}
										title={app.name}
										onClick={(e)=>{return this.onClick(app,e)}}
									/>
									
								))}
							</AppLauncherExpandableSection>
							<hr />
							<AppLauncherExpandableSection title="所有项目">
								{tabs?.map((tab, i) => (
									<AppLauncherLink search={this.state.search} onClick={(e)=>{return this.onClick(tab,e)}} >{tab.name}</AppLauncherLink>
								))}
							</AppLauncherExpandableSection>
						</AppLauncher>
					</GlobalNavigationBarRegion>
				</GlobalNavigationBar>
			</IconSettings>
		);
	}
}
