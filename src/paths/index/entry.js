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
        this._reviewers = {};
        this._orderedReviewers = [];
        this._selectedGroup = -1;
        this._selectedIsPerson = false;

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
            this._reviewers = data.reviewers;
            this._authors = data.authors;
            this._pulls = data.pulls;

            this._orderedTeams = Object.values(this._teams);
            this._orderedTeams.sort((a, b) => {
                if (a.id === -1) return -1;
                if (b.id === -1) return -1;

                const a_name = a.name.toLowerCase().replace(/^_/, "");
                const b_name = b.name.toLowerCase().replace(/^_/, "");

                if (a_name > b_name) return 1;
                if (a_name < b_name) return -1;
                return 0;
            });

            this._orderedReviewers = Object.values(this._reviewers);
            this._orderedReviewers.sort((a, b) => {
                const a_name = a.name.toLowerCase();
                const b_name = b.name.toLowerCase();

                if (a_name > b_name) return 1;
                if (a_name < b_name) return -1;
                return 0;
            });

            // Try to select the team or the reviewer that was passed in the URL.
            let hasPresetGroup = false;
            const requested_slug = greports.util.getHistoryHash();
            if (requested_slug !== "") {
                for (let i = 0; i < this._orderedTeams.length; i++) {
                    const team = this._orderedTeams[i];
                    if (team.slug === requested_slug) {
                        this._selectedGroup = team.id;
                        this._selectedIsPerson = false;
                        hasPresetGroup = true;
                        break;
                    }
                }

                if (!hasPresetGroup) {
                    for (let i = 0; i < this._orderedReviewers.length; i++) {
                        const reviewer = this._orderedReviewers[i];
                        if (reviewer.slug === requested_slug) {
                            this._selectedGroup = reviewer.id;
                            this._selectedIsPerson = true;
                            hasPresetGroup = true;
                            break;
                        }
                    }
                }
            }

            // If no team/reviewer was passed in the URL, or that team/reviewer is not available, use the first team.
            if (!hasPresetGroup) {
                if (this._orderedTeams.length) {
                    this._selectedGroup = this._orderedTeams[0].id;
                    greports.util.setHistoryHash(this._orderedTeams[0].slug);
                } else {
                    this._selectedGroup = -1;
                    greports.util.setHistoryHash("");
                }
            }
        } else {
            this._generatedAt = null;
            this._teams = {};
            this._orderedTeams = [];
            this._reviewers = {};
            this._orderedReviewers = [];
            this._selectedGroup = -1;
            this._selectedIsPerson = false;
            this._authors = {};
            this._pulls = [];
        }

        this.requestUpdate();
    }

    onTabClicked(event) {
        this._selectedGroup = event.detail.tabId;
        this._selectedIsPerson = event.detail.isPerson;
        this.requestUpdate();

        window.scrollTo(0, 0);
    }

    render(){
        let pulls = [];
        this._pulls.forEach((pull) => {
            if (!this._selectedIsPerson && pull.teams.includes(this._selectedGroup)) {
                pulls.push(pull);
            }
            if (this._selectedIsPerson && pull.reviewers.includes(this._selectedGroup)) {
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
                        .reviewers="${this._orderedReviewers}"
                        .selected="${this._selectedGroup}"
                        .selected_is_person="${this._selectedIsPerson}"
                        @tabclick="${this.onTabClicked}"
                    ></gr-team-list>
                    
                    <gr-pull-list
                        .pulls="${pulls}"
                        .teams="${this._teams}"
                        .selected_group="${this._selectedGroup}"
                        .selected_is_person="${this._selectedIsPerson}"
                        .authors="${this._authors}"
                    ></gr-pull-list>
                </div>
            </page-content>
        `;
    }
}