import { LitElement, html, css, customElement, property } from 'lit-element';

@customElement('gr-index-description')
export default class IndexDescription extends LitElement {
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
            line-height: 22px;
          }
        `;
    }

    @property({ type: Date }) generated_at = null;

    render() {
        return html`
            <p>
                This page lists all open pull-requests (PRs) assigned to every core maintenance team.
                <br/>
                Contributors are encouraged to collaborate and clear the backlog by giving these PRs a proper look
                and either accepting or rejecting them.
                <br/>
                Positively reviewed PRs are open to be merged by responsible maintainers.
            </p>
        `;
    }
}