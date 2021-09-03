import { LitElement, html, css, customElement, property } from 'lit-element';

import TeamItem from "./TeamItem";

@customElement('gr-team-list')
export default class TeamList extends LitElement {
    static get styles() {
        return css`
          /** Colors and variables **/
          :host {
            --teams-background-color: #fcfcfa;
            --teams-border-color: #515c6c;
            --section-active-border-color: #397adf;
          }
          @media (prefers-color-scheme: dark) {
            :host {
              --teams-background-color: #0d1117;
              --teams-border-color: #515c6c;
              --section-active-border-color: #397adf;
            }
          }
          
          /** Component styling **/
          :host {
          }

          :host .team-list {
            background-color: var(--teams-background-color);
            border-right: 2px solid var(--teams-border-color);
            width: 240px;
            min-height: 216px;
          }

          :host .team-list-switcher {
            display: flex;
            flex-direction: row;
            justify-content: center;
          }
          :host .team-list-title {
            cursor: pointer;
            margin: 0 10px 12px 10px;
          }
          :host .team-list-title--active {
            border-bottom: 3px solid var(--section-active-border-color);
          }
          
          :host .team-list-section {
            display: none;
          }
          :host .team-list-section--active {
            display: block;
          }
        `;
    }

    @property({ type: Array }) teams = [];
    @property({ type: Array }) reviewers = [];
    @property({ type: Number }) selected = -1;
    @property({ type: Boolean }) selected_is_person = false;

    constructor() {
        super();

        this._currentSection = "teams";
    }

    onSwitcherClicked(switchTo, event) {
        this._currentSection = switchTo;
        this.requestUpdate();
    }

    onTabClicked(tabId, tabSlug, isPerson, event) {
        this.dispatchEvent(greports.util.createEvent("tabclick", {
            "tabId": tabId,
            "isPerson": isPerson,
        }));

        greports.util.setHistoryHash(tabSlug);
    }

    update(changedProperties) {
        if (changedProperties.has("selected_is_person")) {
            this._currentSection = (this.selected_is_person ? "reviewers" : "teams");
        }

        super.update(changedProperties);
    }

    render() {
        const teamsClassList = [ "team-list-section", "team-list-section--teams" ];
        if (this._currentSection === "teams") {
            teamsClassList.push("team-list-section--active");
        }
        const reviewersClassList = [ "team-list-section", "team-list-section--reviewers" ];
        if (this._currentSection === "reviewers") {
            reviewersClassList.push("team-list-section--active");
        }

        return html`
            <div class="team-list">
                <div class="team-list-switcher">
                    <h4
                        class="team-list-title ${(this._currentSection === "teams") ? "team-list-title--active" : ""}"
                        @click="${this.onSwitcherClicked.bind(this, "teams")}"
                    >
                        Teams
                    </h4>
                    <h4
                        class="team-list-title ${(this._currentSection === "reviewers") ? "team-list-title--active" : ""}"
                        @click="${this.onSwitcherClicked.bind(this, "reviewers")}"
                    >
                        Reviewers
                    </h4>
                </div>

                <div class="${teamsClassList.join(" ")}">
                    ${(this.teams.length > 0) ?
                        this.teams.map((item) => {
                            return html`
                                <gr-team-item
                                    .id="${item.id}"
                                    .name="${item.name}"
                                    .avatar="${item.avatar}"
                                    .pull_count="${item.pull_count}"
                                    ?active="${!this.selected_is_person && this.selected === item.id}"
                                    @click="${this.onTabClicked.bind(this, item.id, item.slug, false)}"
                                />
                            `;
                        }) : html`
                            <span>There are no teams</span>
                        `
                    }
                </div>
                
                <div class="${reviewersClassList.join(" ")}">
                    ${(this.reviewers.length > 0) ?
                        this.reviewers.map((item) => {
                            return html`
                                <gr-team-item
                                    .id="${item.id}"
                                    .name="${item.name}"
                                    .avatar="${item.avatar}"
                                    .pull_count="${item.pull_count}"
                                    ?active="${this.selected_is_person && this.selected === item.id}"
                                    @click="${this.onTabClicked.bind(this, item.id, item.slug, true)}"
                                />
                            `;
                        }) : html`
                            <span>There are no reviewers</span>
                        `
                    }
                </div>
            </div>
        `;
    }
}