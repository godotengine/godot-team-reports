import { LitElement, html, css, customElement, property } from 'lit-element';

@customElement('gr-team-tab')
export default class TeamTab extends LitElement {
    static get styles() {
        return css`
          /** Colors and variables **/
          :host {
            --tab-hover-background-color: rgba(0, 0, 0, 0.14);
            --tab-active-background-color: #2c3c55;
            --tab-active-border-color: #397adf;
          }
          @media (prefers-color-scheme: dark) {
            :host {
              --tab-hover-background-color: rgba(255, 255, 255, 0.14);
              --tab-active-background-color: #2c3c55;
              --tab-active-border-color: #397adf;
            }
          }
          
          /** Component styling **/
          :host {
            max-width: 240px;
          }
          
          :host .tab-container {
            border-left: 5px solid transparent;
            cursor: pointer;
            display: flex;
            flex-direction: row;
            padding: 2px 12px;
          }
          :host .tab-container:hover {
            background-color: var(--tab-hover-background-color);
          }
          :host .tab-container--active {
            background-color: var(--tab-active-background-color);
            border-left: 5px solid var(--tab-active-border-color);
          }

          :host .tab-icon {
            display: inline-block;
            width: 16px;
            height: 16px;
          }
          
          :host .tab-title {
            color: var(--g-font-color);
            font-size: 13px;
            padding-left: 12px;
            white-space: nowrap;
          }
        `;
    }

    @property({ type: Number }) id = -1;
    @property({ type: String, reflect: true }) name = '';
    @property({ type: String, reflect: true }) avatar = '';
    @property({ type: Boolean, reflect: true }) active = false;

    render(){
        const classList = [ "tab-container" ];
        if (this.active) {
            classList.push("tab-container--active");
        }

        return html`
            <div class="${classList.join(" ")}">
                <div 
                    class="tab-icon"
                    style="background-image: url('${this.avatar}')"
                ></div>
                <span
                    class="tab-title"
                >
                    ${this.name}
                </span>
            </div>
        `;
    }
}