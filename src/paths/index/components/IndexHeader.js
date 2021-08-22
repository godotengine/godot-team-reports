import { LitElement, html, css, customElement, property } from 'lit-element';

@customElement('gr-index-entry')
export default class IndexHeader extends LitElement {
    static get styles() {
        return css`
          /** Colors and variables **/
          :host {
            --header-meta-color: #515c6c;
          }
          @media (prefers-color-scheme: dark) {
            :host {
              --header-meta-color: #515c6c;
            }
          }
          
          /** Component styling **/
          :host {
          }
          
          :host .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          
          :host .header-metadata {
            color: var(--header-meta-color);
          }
          :host .header-metadata a {
            color: var(--link-font-color);
            text-decoration: none;
          }
          :host .header-metadata a:hover {
            color: var(--link-font-color-hover);
          }
        `;
    }

    @property({ type: Date }) generated_at = null;

    render() {
        return html`
            <div class="header">
                <h1>
                    Godot Team Reports
                </h1>
                <div class="header-metadata">
                    <span>data generated on ${greports.format.formatTimestamp(this.generated_at)}</span>
                    <br/>
                    <a
                            href="https://github.com/pycbouh/godot-team-reports"
                            target="_blank"
                    >
                        contribute on GitHub
                    </a>
                </div>
            </div>
        `;
    }
}