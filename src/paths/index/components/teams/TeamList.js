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
            --teams-mobile-color: #9bbaed;
          }
          @media (prefers-color-scheme: dark) {
            :host {
              --teams-background-color: #0d1117;
              --teams-border-color: #515c6c;
              --section-active-border-color: #397adf;
              --teams-mobile-color: #222c3d;
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
          :host .team-list-section--selected:after {
            content: '';
            background: var(--section-active-border-color);
            border-radius: 2px;
            display: inline-block;
            height: 4px;
            width: 4px;
            vertical-align: super;
          }
          :host .team-mobile-container {
            display: none;
            padding: 0 12px 24px 12px;
          }
          :host .team-mobile-button {
            width: 100%;
            padding: 12px 0;
            margin: 0;
            border: none;
            border-radius: 4px;
            background: var(--teams-mobile-color);
            text-align: center;
            cursor: pointer;
          }

          @media only screen and (max-width: 900px) {
            :host {
              width: 100%
            }
            :host .team-list {
              display: none;
              width: 100% !important;
            }
            :host .team-mobile-container,
            :host .team-list.team-list--active {
              display: block !important;
            }
          }
        `;
    }

    @property({ type: Array }) teams = [];
    @property({ type: Array }) reviewers = [];
    @property({ type: Number }) selected = {};
    @property({ type: Boolean }) selected_is_person = false;

    constructor() {
        super();

        this._currentSection = "teams";
        this._mobileActive = false;
    }

    onMobileClicked() {
        this._mobileActive = !this._mobileActive;
        this.requestUpdate();
    }

    onSwitcherClicked(switchTo, event) {
        this._currentSection = switchTo;
        this.requestUpdate();
    }

    onTabClicked(tab, isPerson, event) {
        this.dispatchEvent(greports.util.createEvent("tabclick", {
            "tab": tab,
            "isPerson": isPerson,
        }));

        greports.util.setHistoryHash(tab.slug);
        this._mobileActive = false;
        this.requestUpdate();
    }

    update(changedProperties) {
        if (changedProperties.has("selected_is_person")) {
            this._currentSection = (this.selected_is_person ? "reviewers" : "teams");
        }

        super.update(changedProperties);
    }

    render() {
        const teamsTitleClassList = [ "team-list-title" ];
        if (this._currentSection === "teams") {
            teamsTitleClassList.push("team-list-title--active");
        }
        if (!this.selected_is_person) {
            teamsTitleClassList.push("team-list-section--selected");
        }
        const reviewersTitleClassList = [ "team-list-title" ];
        if (this._currentSection === "reviewers") {
            reviewersTitleClassList.push("team-list-title--active");
        }
        if (this.selected_is_person) {
            reviewersTitleClassList.push("team-list-section--selected");
        }

        const teamsClassList = [ "team-list-section", "team-list-section--teams" ];
        if (this._currentSection === "teams") {
            teamsClassList.push("team-list-section--active");
        }
        const reviewersClassList = [ "team-list-section", "team-list-section--reviewers" ];
        if (this._currentSection === "reviewers") {
            reviewersClassList.push("team-list-section--active");
        }

        const containerClassList = ["team-list"];
        if (this._mobileActive) {
            containerClassList.push("team-list--active");
        }

        return html`
            <div class="team-mobile-container">
                <p class="team-mobile-button" @click="${this.onMobileClicked.bind(this)}">
                    ${(this.selected_is_person) ? html `Reviewer : ` : html `Team : `} ${this.selected.name}
                </p>
            </div>
            <div class="${containerClassList.join(" ")}">
                <div class="team-list-switcher">
                    <h4
                        class="${teamsTitleClassList.join(" ")}"
                        @click="${this.onSwitcherClicked.bind(this, "teams")}"
                    >
                        Teams
                    </h4>
                    <h4
                        class="${reviewersTitleClassList.join(" ")}"
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
                                    ?active="${!this.selected_is_person && this.selected.id === item.id}"
                                    @click="${this.onTabClicked.bind(this, item, false)}"
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
                                    ?active="${this.selected_is_person && this.selected.id === item.id}"
                                    @click="${this.onTabClicked.bind(this, item, true)}"
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