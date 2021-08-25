import { LitElement, html, css, customElement, property } from 'lit-element';

import PageContent from 'src/shared/components/PageContent';
import IndexHeader from "./components/IndexHeader";
import IndexDescription from "./components/IndexDescription";

import TeamList from "./components/teams/TeamList";
import PullRequestList from "./components/prs/PullRequestList";

@customElement('entry-component')
export default class EntryComponent extends LitElement {
    static get styles() {
        return css`
          /** Colors and variables **/
          :host {
          }
          @media (prefers-color-scheme: dark) {
            :host {
            }
          }
          
          /** Component styling **/
          :host {
          }
          
          :host .teams {
            display: flex;
            padding: 24px 0;
          }
        `;
    }

    constructor() {
        super();

        this._entryRequested = false;
        this._generatedAt = null;

        this._teams = {};
        this._orderedTeams = [];
        this._selectedTeam = -1;

        this._authors = {};
        this._pulls = [];

        this._requestData();
    }

    performUpdate() {
        this._requestData();
        super.performUpdate();
    }

    async _requestData() {
        if (this._entryRequested) {
            return;
        }
        this._entryRequested = true;
        const data = await greports.api.getData();

        if (data) {
            this._generatedAt = data.generated_at;
            this._teams = data.teams;
            this._authors = data.authors;
            this._pulls = data.pulls;

            this._orderedTeams = Object.values(this._teams);
            this._orderedTeams.sort((a, b) => {
                if (a.id === -1) return -1;
                if (b.id === -1) return -1;

                if (a.name > b.name) return 1;
                if (a.name < b.name) return -1;
                return 0;
            });

            // Try to select the team that was passed in the URL.
            let hasPresetTeam = false;
            const requested_slug = greports.util.getHistoryHash();
            if (requested_slug !== "") {
                for (let i = 0; i < this._orderedTeams.length; i++) {
                    const team = this._orderedTeams[i];
                    if (team.slug === requested_slug) {
                        this._selectedTeam = team.id;
                        hasPresetTeam = true;
                        break;
                    }
                }
            }

            // If no team was passed in the URL, or that team is not available, use the first one.
            if (!hasPresetTeam) {
                if (this._orderedTeams.length) {
                    this._selectedTeam = this._orderedTeams[0].id;
                    greports.util.setHistoryHash(this._orderedTeams[0].slug);
                } else {
                    this._selectedTeam = -1;
                    greports.util.setHistoryHash("");
                }
            }
        } else {
            this._generatedAt = null;
            this._teams = {};
            this._orderedTeams = [];
            this._selectedTeam = -1;
            this._authors = {};
            this._pulls = [];
        }

        this.requestUpdate();
    }

    onTabClicked(event) {
        this._selectedTeam = event.detail.tabId;
        this.requestUpdate();
    }

    onSortClicked(sortOrder, event) {
        this._sortBy = sortOrder;
        this.requestUpdate();
    }

    render(){
        let pulls = [];
        this._pulls.forEach((pull) => {
           if (pull.teams.includes(this._selectedTeam)) {
               pulls.push(pull);
           }
        });

        return html`
            <page-content>
                <gr-index-entry .generated_at="${this._generatedAt}"></gr-index-entry>
                <gr-index-description></gr-index-description>
                
                <div class="teams">
                    <gr-team-list
                        .teams="${this._orderedTeams}"
                        .selected_team="${this._selectedTeam}"
                        @tabclick="${this.onTabClicked}"
                    ></gr-team-list>
                    
                    <gr-pull-list
                        .pulls="${pulls}"
                        .teams="${this._teams}"
                        .selected_team="${this._selectedTeam}"
                        .authors="${this._authors}"
                    ></gr-pull-list>
                </div>
            </page-content>
        `;
    }
}