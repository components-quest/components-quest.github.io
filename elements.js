{
    console.logComponent = (...args) => {
        console.log(`%c ${this.nodeName} `, "background:purple;color:gold", ...args);
    }
    const createElement = (tagName, props = {}, ...children) => {
        const element = document.createElement(tagName);
        if (props.attrs) {
            Object.entries(props.attrs).forEach(([name, value]) =>
                element.setAttribute(name, value)
            );
            delete props.attrs;
        }
        element.append(...children.flat()
            .map(child =>
                (child instanceof Node) ? child : document.createTextNode(child)
            ));
        return Object.assign(element, props);
    }
    //-------------------------------------------------------------------------
    function indentJSCode(jsCode, indentSize = 4) {
        let lines = jsCode.split('\n');
        let indentLevel = 0;
        let indentString = ' '.repeat(indentSize);
        return lines.map(line => {
            if (line.includes('}')
                //|| line.includes(']')
            ) indentLevel--;
            if (indentLevel < 0) indentLevel = 0;
            let indentedLine = indentString.repeat(indentLevel) + line.trim();
            if (line.includes('{')
                //|| line.includes('[')
            ) indentLevel++;
            return indentedLine;
        }).join('\n');
    }
    // ************************************************************************
    customElements.define("load-codapi", class extends HTMLElement {
        connectedCallback() {
            let version = this.getAttribute("version");
            document.head.append(
                createElement("link", {
                    rel: "stylesheet",
                    href: `https://unpkg.com/@antonz/codapi@${version}/dist/snippet.css`
                }),
                createElement("script", {
                    src: "https://unpkg.com/@antonz/codapi@${version}/dist/snippet.js"
                })
            );
        }
    });
    // ************************************************************************
    customElements.define("components-quest-logo", class extends HTMLElement {
        constructor() {
            super()
                .attachShadow({ mode: "open" })
                .append(
                    createElement("style", {
                        innerHTML: `
                    :host{display:block}
                    :host([hidden]){display:none}`
                    }),
                    createElement("div", {
                        innerHTML: `<img src="https://components-quest.github.io/images/components-quest-logo.svg">`
                    })
                );
        }
    });
    // ************************************************************************
    customElements.define("components-quest-header", class extends HTMLElement {
        connectedCallback() {
            this.append(
                createElement("components-quest-logo", {})
            );
        }
    });
    customElements.define("components-quest-footer", class extends HTMLElement {
        connectedCallback() {
            this.append(
                createElement("hr", {
                    style: "margin-top:2em "
                }),
                createElement("span", {
                    innerHTML: `Components Quest &copy; ${new Date().getFullYear()}`,
                    onclick: () => location.href = "https://components-quest.github.io/"
                }),
            );
        }
    });
    // ************************************************************************
    customElements.whenDefined("mark-down").then(() => {
        customElements.define("mark-down-load-file", class extends HTMLElement {
            connectedCallback() {
                let src = this.src || this.getAttribute("src");
                fetch(src)
                    .then(response => response.text())
                    .then(text => this.innerHTML = `<mark-down>${text}</mark-down>`)
                    .catch(error => console.error(error));
            }
        });
        customElements.define("mark-down-file", class extends HTMLElement {
            connectedCallback() {
                // attributes not available in constructor
                this
                    .attachShadow({ mode: "open" })
                    .append(
                        createElement("style", {
                            innerHTML:
                                `:host{display:block}` +
                                `:host([hidden]){display:none}`
                        }),
                        createElement("mark-down-load-file", {
                            src: this.getAttribute("src") || "README.md"
                        })
                    );
            }
        });
    });
    // ************************************************************************
    customElements.define("component-script", class extends HTMLElement {
        // ====================================================================
        constructor() {
            super().attachShadow({
                mode: "open"
            });
        }
        // ====================================================================
        connectedCallback() {
            setTimeout(() => {
                let outputmode = this.getAttribute("output-mode") || "console";
                console.logComponent(`outputmode:`, this.nodeName, outputmode);
                function preProcessCode(code) {
                    return indentJSCode(code, 4).trim();
                }
                this.shadowRoot
                    .append(
                        createElement("style", {
                            innerHTML:
                                `codapi-toolbar [href="#edit"],` +
                                `codapi-output [href="#close"],` +
                                `codapi-status {di1splay: none}` +
                                `pre{background:pink}`
                        }),
                        this.codepresentation = createElement("pre", {
                            innerHTML: preProcessCode(this.innerHTML)
                        }),
                        this.code = createElement("pre", {
                            style: `disp1lay:none;` +
                                `background:beige`,
                            innerHTML: `` + preProcessCode(this.innerHTML)
                            //+ `return Object.assign(document.createElement(cname),{});`
                        }),
                        this.codeapiSnippet = createElement("codapi-snippet", {
                            attrs: {
                                engine: "browser",
                                editor: "basic",
                                sandbox: "javascript",
                                "output-mode": "dom",
                                // actions: "Explain_Event:@event_explain",
                                //files: "#inline",
                                // overrules the code in <pre>
                                // loads the script file inside <
                                // template: "template_example.js" // runs after Run
                            }
                        })
                    );// append
                this.codeapiSnippet.addEventListener("event_explain", (e) => {
                    const code = e.target.code;
                    // console.warn(e.type, code);
                });
            }, 100)// setTimeout
        }// connectedCallback
        // ====================================================================
    })// customElements.define("component-script")


}