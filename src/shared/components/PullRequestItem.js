import { LitElement, html, css, customElement, property } from 'lit-element';

@customElement('gr-pull-request')
export default class PullRequestItem extends LitElement {
    static get styles() {
        return css`
          /** Colors and variables **/
          :host {
            --pr-border-color: #0d1117;
            --draft-font-color: #e0c537;
            --draft-background-color: #1e313c;
            --stats-background-color: #0f1316;
            --meta-font-color: #929da0;
            
            --review-team-color: #8491ab;
            
            --stat-temp0-color: #000000;
            --stat-temp1-color: #000000;
            --stat-temp2-color: #000000;
            --stat-temp3-color: #000000;
            --stat-temp4-color: #000000;
            --stat-temp5-color: #000000;
            --stat-temp6-color: #000000;
            --stat-temp7-color: #000000;
            --stat-temp8-color: #000000;
            --stat-temp9-color: #000000;
          }
          @media (prefers-color-scheme: dark) {
            :host {
              --pr-border-color: #0d1117;
              --draft-font-color: #e0c537;
              --draft-background-color: #1e313c;
              --stats-background-color: #0f1316;
              --meta-font-color: #929da0;

              --review-team-color: #8491ab;
              
              --stat-temp0-color: #ffffff;
              --stat-temp1-color: #f0ed7e;
              --stat-temp2-color: #f5d94a;
              --stat-temp3-color: #f8b71e;
              --stat-temp4-color: #f38c06;
              --stat-temp5-color: #f06009;
              --stat-temp6-color: #e33b07;
              --stat-temp7-color: #e6240e;
              --stat-temp8-color: #b31605;
              --stat-temp9-color: #d3001c;
            }
          }
          
          /** Component styling **/
          :host {
            border-bottom: 3px solid var(--pr-border-color);
            display: block;
            padding: 14px 12px 20px 12px;
          }
          
          :host a {
            color: var(--link-font-color);
            text-decoration: none;
          }
          :host a:hover {
            color: var(--link-font-color-hover);
          }
          
          :host .pr-title {
            display: block;
            font-size: 20px;
            margin-top: 6px;
            margin-bottom: 12px;
          }
          :host .pr-title > span:nth-of-type(2) {
            color: var(--g-font-color);
          }
          
          :host .pr-title-draft {
            background-color: var(--draft-background-color);
            border-radius: 6px 6px;
            color: var(--draft-font-color);
            font-size: 16px;
            padding: 1px 6px;
            vertical-align: super;
          }
          
          :host .pr-meta {
            color: var(--meta-font-color);
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            font-size: 13px;
          }
          
          :host .pr-labels {
            display: flex;
            flex-flow: column wrap;
            padding: 4px 0;
            max-height: 60px;
          }
          
          :host .pr-label {
            padding-right: 8px;
          }
          :host .pr-label-dot {
            border-radius: 4px;
            display: inline-block;
            width: 8px;
            height: 8px;
          }
          :host .pr-label-name {
            
          }
          
          :host .pr-time {
            
          }
          :host .pr-time-value {
            border-bottom: 1px dashed var(--g-font-color);
            cursor: help;
          }
          
          :host .pr-stats {
            background-color: var(--stats-background-color);
            border-radius: 4px;
            display: flex;
            justify-content: space-around;
            padding: 10px 6px;
            margin-top: 12px;
          }
          
          :host .pr-stat + .pr-stat {
            margin-left: 12px;
          }
          
          :host .pr-stat--temp0 {
            color: var(--stat-temp0-color);
          }
          :host .pr-stat--temp1 {
            color: var(--stat-temp1-color);
          }
          :host .pr-stat--temp2 {
            color: var(--stat-temp2-color);
          }
          :host .pr-stat--temp3 {
            color: var(--stat-temp3-color);
          }
          :host .pr-stat--temp4 {
            color: var(--stat-temp4-color);
          }
          :host .pr-stat--temp5 {
            color: var(--stat-temp5-color);
          }
          :host .pr-stat--temp6 {
            color: var(--stat-temp6-color);
          }
          :host .pr-stat--temp7 {
            color: var(--stat-temp7-color);
          }
          :host .pr-stat--temp8 {
            color: var(--stat-temp8-color);
          }
          :host .pr-stat--temp9 {
            color: var(--stat-temp9-color);
          }
          
          :host .pr-review {
            display: flex;
            justify-content: space-between;
            font-size: 13px;
            margin-top: 14px;
          }

          :host .pr-review-teams {
            max-width: 50%;
          }
          
          :host .pr-review-team {
            color: var(--review-team-color);
            white-space: nowrap;
          }
          :host .pr-review-team + .pr-review-team:before {
            content: "· ";
            white-space: break-spaces;
          }
        `;
    }

    @property({ type: Number }) id = -1;
    @property({ type: String, reflect: true }) title = '';
    @property({ type: String, reflect: true }) url = '';
    @property({ type: String, reflect: true }) diff_url = '';
    @property({ type: String, reflect: true }) patch_url = '';
    @property({ type: Boolean }) draft = false;
    @property({ type: Array }) labels = [];
    @property({ type: String, reflect: true }) milestone = '';
    @property({ type: String, reflect: true }) branch = '';
    @property({ type: String }) created_at = '';
    @property({ type: String }) updated_at = '';
    @property({ type: Array }) teams = [];

    getStatTemp(value, factor) {
        let temp = Math.floor(value / factor);
        if (temp > 9) {
            temp = 9;
        }

        return temp;
    }

    render(){
        const created_days = greports.format.getDaysSince(this.created_at);
        const stale_days = greports.format.getDaysSince(this.updated_at);

        return html`
            <div class="pr-container">
                <a
                    class="pr-title"
                    href="${this.url}"
                    target="_blank"
                >
                    <span>#${this.id}</span> <span>${this.title}</span>
                    ${(this.draft ? html`
                        <span class="pr-title-draft">draft</span>
                    ` : '')}
                </a>
                
                <div class="pr-meta">
                    <div class="pr-labels">
                        ${this.labels.map((item) => {
                            return html`
                                <span
                                    class="pr-label"
                                >
                                    <span
                                        class="pr-label-dot"
                                        style="background-color: ${item.color}"
                                    ></span>
                                    <span
                                        class="pr-label-name"
                                    >
                                        ${item.name}
                                    </span>
                                </span>
                            `;
                        })}
                    </div>
                    
                    <div class="pr-milestone">
                        <div>
                            <span>milestone: </span>
                            ${(this.milestone != null) ? html`
                                <a
                                    href="${this.milestone.url}"
                                    target="_blank"
                                >
                                    ${this.milestone.title}
                                </a>
                            ` : html`
                                <span>none</span>
                            `}
                        </div>
                        <div>
                            <span>branch: </span>
                            <span>${this.branch}</span>
                        </div>
                    </div>
                    
                    <div class="pr-timing">
                        <div class="pr-time">
                            <span>created at: </span>
                            <span
                                class="pr-time-value"
                                title="${greports.format.formatTimestamp(this.created_at)}"
                            >
                                ${greports.format.formatDate(this.created_at)}
                            </span>
                        </div>
                        <div class="pr-time">
                            <span>updated at: </span>
                            <span
                                class="pr-time-value"
                                title="${greports.format.formatTimestamp(this.updated_at)}"
                            >
                                ${greports.format.formatDate(this.updated_at)}
                            </span>
                        </div>
                    </div>
                </div>
                
                <div class="pr-stats">
                    <div class="pr-stat">
                        <span>lifetime: </span>
                        <span
                            class="pr-stat--temp${this.getStatTemp(created_days, 14)}"
                        >
                            ${greports.format.formatDays(created_days)}
                        </span>
                    </div>
                    <div class="pr-stat">
                        <span>stale for: </span>
                        <span
                            class="pr-stat--temp${this.getStatTemp(stale_days, 14)}"
                        >
                            ${greports.format.formatDays(stale_days)}
                        </span>
                    </div>
                </div>
                
                <div class="pr-review">
                    <div class="pr-review-teams">
                        ${(this.teams.length > 0) ? html`
                            <span>also awaiting reviews from: </span>
                            ${this.teams.map((item) => {
                                return html`
                                    <span class="pr-review-team">${item}</span>
                                `;
                            })}
                        ` : ''}
                    </div>
                    <div class="pr-download">
                        <span>download changelog: </span>
                        <a
                            href="${this.diff_url}"
                            target="_blank"
                        >
                            diff
                        </a> | 
                        <a
                            href="${this.patch_url}"
                            target="_blank"
                        >
                            patch
                        </a>
                    </div>
                    
                </div>
            </div>
        `;
    }
}