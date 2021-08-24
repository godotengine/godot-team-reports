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
          }
          @media (prefers-color-scheme: dark) {
            :host {
              --teams-background-color: #0d1117;
              --teams-border-color: #515c6c;
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

          :host .team-list h4 {
            margin: 0 0 12px 0;
          }
        `;
    }

    @property({ type: Array }) teams = [];
    @property({ type: Number }) selected_team = -1;

    onTabClicked(tabId, event) {
        this.dispatchEvent(greports.util.createEvent("tabclick", {
            "tabId": tabId,
        }));
    }

    render() {
        return html`
            <div class="team-list">
                <h4>Teams:</h4>

                ${(this.teams.length > 0) ?
                    this.teams.map((item) => {
                        return html`
                            <gr-team-item
                                    .id="${item.id}"
                                    .name="${item.name}"
                                    .avatar="${item.avatar}"
                                    ?active="${this.selected_team === item.id}"
                                    @click="${this.onTabClicked.bind(this, item.id)}"
                            />
                        `;
                    }) : html`
                        <span>Loading...</span>
                    `
                }
            </div>
        `;
    }
}