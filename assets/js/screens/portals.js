/* ==========================================================================
   elan1 · PORTALS — external surfaces with no console chrome (owner: portals)
   For people who do not trust elan1 by default: sober, evidential, precise.

   Public verifier   /verify · /verify/result · /verify/exit-codes · /verify/releases(/:version)
                     /verify/tampered · /verify/fingerprints · /verify/report-guide
   Auditor portal    /auditor · /auditor/checklist · /auditor/reconciliation · /auditor/records(/:seq)
                     /auditor/nightly · /auditor/declarations · /auditor/requests(/new)
                     /auditor/bundle/:id · /auditor/pilot/:id
   Regulator view    /regulator · /regulator/disclosure/:id · /regulator/check · /regulator/log
   Counterparty      /counterparty · /counterparty/receipt/:id · /counterparty/disputes(/:id) · /counterparty/register
   Partner portal    /partners/portal · /partners/portal/clients(/:id) · /partners/portal/engineers · /partners/portal/claims
   Trust centre      /trust (?tab=overview|evidence|controls|subprocessors|updates|faq)

   Every portal renders in layout 'bare' with its own light band: portal name in the
   bare header, then the viewer's organisation, the access terms and the portal's tabs.
   Level honesty: L2/L3 content renders only when E1.atLeast(level); otherwise a designed
   locked explainer with "Preview as L2/L3". The public verifier is level-independent and
   never verifies in the browser — it explains the offline verifier and reads its reports.
   ========================================================================== */
(function () {
  'use strict';
  var E1 = window.E1, c = E1.c, esc = E1.esc, fmt = E1.fmt;

  /* ------------------------------------------------------------------------
     Scoped styles (tokens only — no literal colours)
     ------------------------------------------------------------------------ */
  var CSS = [
    /* Product-portal chrome: the bare header becomes the ink app bar (rung1 / stack1 console family) */
    '.e1-app--bare:has(.e1p){overflow-x:clip}',
    '.e1-app--bare:has(.e1p) .e1-bare__head{position:sticky;top:0;z-index:var(--z-chrome);height:var(--topbar-height);gap:8px;padding:0 16px 0 12px;background:var(--bg-chrome);color:var(--text-on-chrome);border-bottom:1px solid var(--border-chrome)}',
    '.e1-app--bare:has(.e1p) .e1-bare__head :focus-visible{outline-color:var(--ink-300)}',
    '.e1-app--bare:has(.e1p) .e1-bare__head .e1-logo{height:28px;padding:0 12px 0 4px;border-right:1px solid var(--border-chrome);border-radius:0}',
    '.e1-app--bare:has(.e1p) .e1-bare__head .e1-logo img{width:auto;height:22px}',
    '.e1-app--bare:has(.e1p) .e1-bare__head .e1-logo--onlight{display:none!important}',
    '.e1-app--bare:has(.e1p) .e1-bare__head .e1-logo--ondark{display:block!important}',
    '.e1-app--bare:has(.e1p) .e1-bare__title{flex:1;display:flex;align-items:center;gap:8px;padding-left:4px;border-left:0;color:var(--text-on-chrome);font:var(--weight-semibold) 13px/1 var(--font-ui);letter-spacing:0;text-transform:none;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
    '.e1-app--bare:has(.e1p) .e1-bare__title::before{content:"Portal";font:var(--weight-medium) var(--text-caption)/1 var(--font-ui);color:var(--text-on-chrome-quiet);padding-right:8px;border-right:1px solid var(--border-chrome)}',
    '.e1-app--bare:has(.e1p) .e1-bare__head .e1-iconbtn{color:var(--text-on-chrome);width:32px;height:32px;border-radius:var(--radius-sm)}',
    '.e1-app--bare:has(.e1p) .e1-bare__head .e1-iconbtn:hover{background:var(--bg-chrome-hover)}',
    '.e1-app--bare:has(.e1p) .e1-bare__main{max-width:var(--screen-max);padding:24px 32px 56px}',
    '.e1-app--bare:has(.e1p) .e1-bare__foot{padding:10px 32px;font:var(--weight-regular) var(--text-label)/1.4 var(--font-ui);background:var(--bg-surface)}',
    '.e1p-hdr{display:flex;align-items:center;gap:6px;flex:none}',
    '.e1p-hdr[hidden]{display:none}',
    '.e1p-hdr .e1-envpill{cursor:default}',
    '.e1p-hdr__user{display:inline-flex;align-items:center;gap:8px;height:36px;padding:0 4px 0 8px;color:var(--text-on-chrome)}',
    '.e1p-hdr__text{display:flex;flex-direction:column;align-items:flex-end;line-height:1.2}',
    '.e1p-hdr__text b{font:var(--weight-medium) var(--text-caption)/1.2 var(--font-ui);white-space:nowrap}',
    '.e1p-hdr__text span{font-size:var(--text-micro);color:var(--text-on-chrome-quiet);white-space:nowrap}',
    '.e1p-hdr__av{width:28px;height:28px;border-radius:50%;display:grid;place-items:center;background:var(--ink-600);color:var(--ink-100);font:var(--weight-semibold) 10.5px/1 var(--font-ui);flex:none}',
    '@media (max-width:720px){.e1p-hdr__text,.e1p-hdr .e1-envpill{display:none}.e1-app--bare:has(.e1p) .e1-bare__head{padding:0 8px}.e1-app--bare:has(.e1p) .e1-bare__title::before{display:none}.e1-app--bare:has(.e1p) .e1-bare__main{padding:16px 16px 48px}.e1-app--bare:has(.e1p) .e1-bare__foot{padding:10px 16px}}',
    /* context bar under the app bar: who you are here, the access terms, the portal's tabs */
    '.e1p{display:block}',
    '.e1p-band{margin:-24px calc(50% - 50vw) 24px;padding:12px max(32px,calc(50vw - 688px)) 0;background:var(--bg-surface);border-bottom:1px solid var(--border-subtle)}',
    '.e1p-band__top{display:flex;align-items:center;gap:10px 16px;flex-wrap:wrap}',
    '.e1p-org{display:flex;align-items:center;gap:10px;min-width:0;flex:1 1 360px}',
    '.e1p-org__mark{width:32px;height:32px;border-radius:var(--radius-sm);background:var(--bg-chrome);display:grid;place-items:center;font:var(--weight-semibold) 11px/1 var(--font-ui);color:var(--text-on-chrome);flex:none;letter-spacing:.02em}',
    '.e1p-org__eyebrow{font-size:var(--text-label);line-height:var(--lh-label);letter-spacing:var(--tracking-label);text-transform:uppercase;color:var(--text-tertiary);font-weight:var(--weight-semibold)}',
    '.e1p-org__name{font:var(--weight-semibold) var(--text-body)/1.3 var(--font-ui);color:var(--text-primary)}',
    '.e1p-org__sub{font-size:var(--text-caption);color:var(--text-secondary);line-height:var(--lh-caption)}',
    '.e1p-tools{display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-left:auto}',
    '@media (min-width:721px){.e1p-tools .e1-envtag{display:none}}',
    '.e1p-facts{display:flex;flex-wrap:wrap;gap:6px;margin-top:10px;font-size:var(--text-caption);color:var(--text-secondary)}',
    '.e1p-fact{display:inline-flex;align-items:center;gap:6px;min-height:24px;padding:2px 8px;border:1px solid var(--border-subtle);border-radius:var(--radius-sm);background:var(--bg-sunken)}',
    '.e1p-fact .e1-icon{color:var(--text-tertiary);flex:none}',
    '.e1p-fact strong{color:var(--text-primary);font-weight:var(--weight-semibold)}',
    '.e1p-nav{display:flex;gap:var(--space-5);overflow-x:auto;margin-top:6px;scrollbar-width:none}',
    '.e1p-nav::-webkit-scrollbar{display:none}',
    '.e1p-nav a{display:inline-flex;align-items:center;gap:6px;height:40px;padding:0 2px;font:var(--weight-medium) 13px/1 var(--font-ui);color:var(--text-secondary);border-bottom:2px solid transparent;white-space:nowrap;text-decoration:none}',
    '.e1p-nav a .e1-icon{color:var(--text-tertiary)}',
    '.e1p-nav a:hover{color:var(--text-primary)}',
    '.e1p-nav a[aria-current]{color:var(--text-primary);border-bottom-color:var(--brand-clay);font-weight:var(--weight-semibold)}',
    '.e1p-nav a[aria-current] .e1-icon{color:var(--text-primary)}',
    '.e1p-nav .e1-level{transform:scale(.9)}',
    '@media (max-width:720px){.e1p-band{margin:-16px calc(50% - 50vw) 20px;padding:10px 16px 0}.e1p-org{flex-basis:100%}.e1p-tools{margin-left:0}.e1p-fact{white-space:normal}}',
    /* layout helpers */
    '.e1p-grid{display:grid;gap:16px}',
    '.e1p-grid--2{grid-template-columns:repeat(2,minmax(0,1fr))}',
    '.e1p-grid--3{grid-template-columns:repeat(3,minmax(0,1fr))}',
    '.e1p-grid--4{grid-template-columns:repeat(4,minmax(0,1fr))}',
    '.e1p-main-side{display:grid;grid-template-columns:minmax(0,1fr) 340px;gap:24px;align-items:start}',
    '@media (max-width:1080px){.e1p-grid--4{grid-template-columns:repeat(2,minmax(0,1fr))}.e1p-main-side{grid-template-columns:minmax(0,1fr)}}',
    '@media (max-width:720px){.e1p-grid--2,.e1p-grid--3,.e1p-grid--4{grid-template-columns:minmax(0,1fr)}}',
    '.e1p-gap{height:16px}',
    '.e1p-mt{margin-top:24px}',
    '.e1p-note{font-size:var(--text-caption);color:var(--text-secondary);line-height:var(--lh-caption)}',
    '.e1p-quote{margin:0;padding:12px 16px;font-size:var(--text-body);border-left:3px solid var(--border-strong);background:var(--bg-sunken);border-radius:0 var(--radius-md) var(--radius-md) 0;color:var(--text-primary);line-height:var(--lh-body)}',
    '.e1p-quote cite{display:block;margin-top:8px;font-style:normal;font-size:var(--text-caption);color:var(--text-tertiary)}',
    '.e1p-panel{border:1px solid var(--border-subtle);border-radius:var(--radius-md);background:var(--bg-surface);box-shadow:var(--shadow-1);padding:var(--space-4) var(--pane-padding)}',
    '.e1p-panel--sunken{background:var(--bg-sunken);box-shadow:none}',
    '.e1p-panel h3{margin:4px 0 6px;font:var(--weight-title) 15px/1.3 var(--font-display);letter-spacing:-.01em;color:var(--text-primary)}',
    '.e1p-panel p{margin:0 0 8px;color:var(--text-secondary);font-size:var(--text-caption);line-height:var(--lh-caption)}',
    '.e1p-panel p:last-child{margin-bottom:0}',
    /* hero */
    '.e1p-hero{display:grid;grid-template-columns:minmax(0,1.25fr) minmax(0,1fr);gap:24px;align-items:start;margin-bottom:24px}',
    '.e1p-hero h1{font:var(--weight-title) var(--text-page-title)/var(--lh-page-title) var(--font-display);letter-spacing:var(--tracking-title);margin:0 0 6px;color:var(--text-primary)}',
    '.e1p-hero__lead{font-size:var(--text-lead);line-height:var(--lh-lead);color:var(--text-secondary);margin:0 0 16px;max-width:70ch}',
    '.e1p-facts-list{list-style:none;padding:0;margin:0;display:grid;gap:10px}',
    '.e1p-facts-list li{display:grid;grid-template-columns:20px 1fr;gap:10px;color:var(--text-primary);font-size:var(--text-body);line-height:var(--lh-body)}',
    '.e1p-facts-list .e1-icon{color:var(--text-tertiary);margin-top:2px}',
    '@media (max-width:900px){.e1p-hero{grid-template-columns:minmax(0,1fr)}}',
    /* numbered steps */
    '.e1p-steps{list-style:none;padding:0;margin:0;display:grid;gap:12px;counter-reset:e1ps}',
    '.e1p-steps>li{counter-increment:e1ps;display:grid;grid-template-columns:28px minmax(0,1fr);gap:12px;padding:14px var(--pane-padding);border:1px solid var(--border-subtle);border-radius:var(--radius-md);background:var(--bg-surface);box-shadow:var(--shadow-1)}',
    '.e1p-steps>li::before{content:counter(e1ps);width:28px;height:28px;border-radius:var(--radius-sm);display:grid;place-items:center;background:var(--bg-sunken);border:1px solid var(--border-default);font:var(--weight-semibold) var(--text-caption)/1 var(--font-mono);color:var(--text-primary)}',
    '.e1p-steps h3{margin:4px 0 4px;font:var(--weight-title) 15px/1.3 var(--font-display);letter-spacing:-.01em;color:var(--text-primary)}',
    '.e1p-steps p{margin:0 0 8px;color:var(--text-secondary);font-size:var(--text-body);line-height:var(--lh-body)}',
    '.e1p-steps p:last-child{margin-bottom:0}',
    '.e1p-steps .e1-code{margin-top:8px}',
    /* verdict */
    '.e1p-verdict{display:grid;grid-template-columns:auto minmax(0,1fr);gap:8px 20px;padding:16px var(--pane-padding);border:1px solid var(--state-neutral-border);border-left-width:4px;border-left-color:var(--state-neutral);background:var(--state-neutral-bg);border-radius:var(--radius-md)}',
    '.e1p-verdict--good{border-color:var(--state-good-border);border-left-color:var(--state-good);background:var(--state-good-bg)}',
    '.e1p-verdict--critical{border-color:var(--state-critical-border);border-left-color:var(--state-critical);background:var(--state-critical-bg)}',
    '.e1p-verdict--serious{border-color:var(--state-serious-border);border-left-color:var(--state-serious);background:var(--state-serious-bg)}',
    '.e1p-verdict--warning{border-color:var(--state-warning-border);border-left-color:var(--state-warning);background:var(--state-warning-bg)}',
    '.e1p-verdict--info{border-color:var(--state-info-border);border-left-color:var(--state-info);background:var(--state-info-bg)}',
    '.e1p-verdict__code{font:var(--weight-semibold) 36px/1 var(--font-mono);color:var(--text-primary);min-width:48px}',
    '.e1p-verdict__code small{display:block;font-family:var(--font-ui);font-size:var(--text-micro);letter-spacing:var(--tracking-label);text-transform:uppercase;color:var(--text-tertiary);margin-top:8px;font-weight:var(--weight-semibold)}',
    '.e1p-verdict__line{font:var(--weight-semibold) 18px/1.3 var(--font-mono);color:var(--text-primary);margin:2px 0 8px;display:flex;align-items:center;gap:12px;flex-wrap:wrap}',
    '.e1p-verdict__means{margin:0 0 6px;color:var(--text-primary);line-height:var(--lh-body)}',
    '.e1p-verdict__next{margin:0;color:var(--text-secondary);line-height:var(--lh-body)}',
    '.e1p-verdict__next strong{color:var(--text-primary)}',
    '@media (max-width:720px){.e1p-verdict{grid-template-columns:1fr}.e1p-verdict__code{font-size:28px}}',
    /* report sections */
    '.e1p-report{display:grid;gap:12px;counter-reset:e1pr}',
    '.e1p-rsec{border:1px solid var(--border-subtle);border-radius:var(--radius-md);background:var(--bg-surface);box-shadow:var(--shadow-1);overflow:hidden}',
    '.e1p-rsec__head{display:flex;align-items:center;gap:12px;min-height:44px;padding:8px var(--pane-padding);border-bottom:1px solid var(--border-subtle);background:var(--bg-surface)}',
    '.e1p-rsec__n{display:inline-grid;place-items:center;width:22px;height:22px;border-radius:var(--radius-sm);background:var(--bg-sunken);font:var(--weight-semibold) var(--text-label)/1 var(--font-mono);color:var(--text-secondary);flex:none}',
    '.e1p-rsec__t{font:var(--weight-title) 15px/1.3 var(--font-display);letter-spacing:-.01em;color:var(--text-primary);margin:0}',
    '.e1p-rsec__note{margin-left:auto;font-size:var(--text-caption);color:var(--text-tertiary)}',
    '.e1p-rsec__body{padding:14px var(--pane-padding)}',
    '.e1p-rsec__body>p{margin:0 0 8px;line-height:var(--lh-body);color:var(--text-primary)}',
    '.e1p-rsec__body>p:last-child{margin-bottom:0}',
    '.e1p-anno{margin-top:10px;padding:10px 12px;border-radius:var(--radius-md);background:var(--bg-sunken);font-size:var(--text-caption);color:var(--text-secondary);display:flex;gap:8px;line-height:1.5}',
    '.e1p-anno .e1-icon{flex:none;margin-top:2px;color:var(--text-accent)}',
    '.e1p-first{font:var(--weight-regular) var(--text-caption)/1.6 var(--font-mono);padding:12px 14px;border-radius:var(--radius-md);background:var(--bg-sunken);border:1px solid var(--border-default);color:var(--text-primary);overflow-x:auto;white-space:pre-wrap;word-break:break-word}',
    /* pills for three-valued results */
    '.e1p-res{display:inline-flex;align-items:center;gap:6px;font:var(--weight-medium) var(--text-caption)/1 var(--font-mono);white-space:nowrap}',
    /* revealed / withheld */
    '.e1p-fields{list-style:none;margin:0;padding:0}',
    '.e1p-fields li{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:9px 0;border-bottom:1px solid var(--border-subtle)}',
    '.e1p-fields li:last-child{border-bottom:0}',
    '.e1p-fields code{font-family:var(--font-mono);font-size:var(--text-caption);color:var(--text-primary)}',
    '.e1p-fields .e1p-v{font-family:var(--font-mono);font-size:var(--text-caption);color:var(--text-primary);text-align:right}',
    '.e1p-fields .e1p-commit{font-family:var(--font-mono);font-size:var(--text-label);color:var(--text-tertiary)}',
    /* result toggles (checklist) */
    '.e1p-test{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:16px;padding:14px var(--pane-padding);border:1px solid var(--border-subtle);border-radius:var(--radius-md);background:var(--bg-surface);box-shadow:var(--shadow-1)}',
    '.e1p-test--hero{border-color:var(--border-default);box-shadow:inset 3px 0 0 var(--border-accent),var(--shadow-1)}',
    '.e1p-test h3{margin:0 0 4px;font:var(--weight-title) 15px/1.3 var(--font-display);letter-spacing:-.01em;color:var(--text-primary);display:flex;gap:10px;align-items:center;flex-wrap:wrap}',
    '.e1p-test dl{display:grid;grid-template-columns:160px minmax(0,1fr);gap:6px 14px;margin:10px 0 0;font-size:var(--text-body)}',
    '.e1p-test dt{color:var(--text-tertiary);font-size:var(--text-caption);text-transform:uppercase;letter-spacing:var(--tracking-label);font-weight:var(--weight-semibold);padding-top:2px}',
    '.e1p-test dd{margin:0;color:var(--text-primary);line-height:var(--lh-body)}',
    '.e1p-test__res{display:flex;flex-direction:column;gap:8px;align-items:flex-end;min-width:220px}',
    '@media (max-width:720px){.e1p-test{grid-template-columns:1fr}.e1p-test__res{align-items:flex-start}.e1p-test dl{grid-template-columns:1fr}}',
    /* terminal */
    '.e1p-term pre{margin:0}',
    /* list rows */
    '.e1p-rows{list-style:none;margin:0;padding:0;border:1px solid var(--border-subtle);border-radius:var(--radius-md);background:var(--bg-surface);box-shadow:var(--shadow-1);overflow:hidden}',
    '.e1p-rows>li{display:flex;gap:12px;align-items:flex-start;padding:12px var(--pane-padding);border-bottom:1px solid var(--border-subtle)}',
    '.e1p-rows>li:last-child{border-bottom:0}',
    '.e1p-rows__icon{flex:none;width:28px;height:28px;border-radius:var(--radius-sm);background:var(--bg-sunken);border:1px solid var(--border-subtle);display:grid;place-items:center;color:var(--text-secondary)}',
    '.e1p-rows__main{flex:1;min-width:0}',
    '.e1p-rows__t{font-weight:var(--weight-semibold);color:var(--text-primary);margin:0 0 2px}',
    '.e1p-rows__d{margin:0;color:var(--text-secondary);font-size:var(--text-caption);line-height:var(--lh-caption)}',
    '.e1p-rows__r{flex:none;display:flex;gap:8px;align-items:center;flex-wrap:wrap;justify-content:flex-end}',
    '@media (max-width:720px){.e1p-rows>li{flex-wrap:wrap}.e1p-rows__r{justify-content:flex-start;width:100%;padding-left:46px}}',
    /* claim pairs (say / never say) */
    '.e1p-say{display:grid;grid-template-columns:1fr 1fr;gap:16px}',
    '.e1p-say ul{margin:8px 0 0;padding-left:18px;font-size:var(--text-body);line-height:var(--lh-body);color:var(--text-primary)}',
    '@media (max-width:720px){.e1p-say{grid-template-columns:1fr}}',
    /* big number link */
    '.e1p-num{font-family:var(--font-mono);font-variant-numeric:tabular-nums}',
    'a.e1p-num{color:var(--text-link)}',
    /* segment bar (L1 | L2) */
    '.e1p-seg{display:flex;height:34px;border-radius:var(--radius-md);overflow:hidden;border:1px solid var(--border-default)}',
    '.e1p-seg>span{display:flex;align-items:center;padding:0 10px;font-size:var(--text-caption);font-family:var(--font-mono);white-space:nowrap;overflow:hidden;color:var(--text-primary)}',
    '.e1p-seg__l1{background:var(--level-1-bg)}',
    '.e1p-seg__l2{background:var(--level-2-bg);border-left:2px solid var(--level-2)}',
    '.e1p-seg__l3{background:var(--level-3-bg);border-left:2px solid var(--level-3)}',
    /* quiz */
    '.e1p-quiz{display:grid;gap:10px}',
    '.e1p-quiz__q{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:12px;align-items:center;padding:12px var(--pane-padding);border:1px solid var(--border-subtle);border-radius:var(--radius-md);background:var(--bg-surface);box-shadow:var(--shadow-1)}',
    '.e1p-quiz__q p{margin:0;color:var(--text-primary);line-height:var(--lh-body)}',
    '.e1p-quiz__why{grid-column:1 / -1;font-size:var(--text-caption);color:var(--text-secondary);margin:0}',
    '@media (max-width:720px){.e1p-quiz__q{grid-template-columns:1fr}}',
    /* upload drop zone */
    '.e1p-drop{display:flex;align-items:center;gap:14px;padding:16px;border:1.5px dashed var(--border-strong);border-radius:var(--radius-md);background:var(--bg-sunken)}',
    '.e1p-drop.is-over{border-color:var(--border-accent);background:var(--bg-selected)}',
    '.e1p-drop input[type=file]{position:absolute;width:1px;height:1px;opacity:0}',
    /* print-like document */
    '.e1p-doc{border:1px solid var(--border-subtle);border-radius:var(--radius-md);background:var(--bg-surface);padding:var(--space-5) var(--space-6);box-shadow:var(--shadow-1)}',
    '@media (max-width:720px){.e1p-doc{padding:18px}}',
    '.e1p-sample{display:inline-flex;align-items:center;gap:6px;font-size:var(--text-micro);text-transform:uppercase;letter-spacing:var(--tracking-label);font-weight:var(--weight-semibold);color:var(--text-tertiary)}'
  ].join('\n');
  (function injectCss() {
    try {
      if (document.getElementById('e1p-css')) return;
      var s = document.createElement('style'); s.id = 'e1p-css'; s.textContent = CSS;
      (document.head || document.documentElement).appendChild(s);
    } catch (e) { /* style injection is cosmetic */ }
  })();

  /* ------------------------------------------------------------------------
     Small helpers
     ------------------------------------------------------------------------ */
  function n(x) { return fmt.num(x); }
  function hx(seed, len) { // deterministic hex for sample digests
    var s = 0, i, out = '';
    seed = String(seed);
    for (i = 0; i < seed.length; i++) s = (s * 31 + seed.charCodeAt(i)) >>> 0;
    for (i = 0; i < len; i++) { s = (s * 1103515245 + 12345) >>> 0; out += '0123456789abcdef'.charAt((s >>> 16) & 15); }
    return out;
  }
  function dig(head, tail, seed) { head = head || ''; tail = tail || ''; return head + hx(seed || head + tail, 64 - head.length - tail.length) + tail; }
  function sel(q, root) { return (root || document).querySelector(q); }
  function selAll(q, root) { return Array.prototype.slice.call((root || document).querySelectorAll(q)); }
  function res(kind, label) { // three-valued result chips, always words
    var m = {
      passed: ['good', label || 'passed'], failed: ['critical', label || 'failed'], na: ['neutral', label || 'not_applicable — assurance level 1'],
      notrun: ['neutral', label || 'not evaluated'], reported: ['info', label || 'reported'], missing: ['warning', label || 'missing'],
      unmet: ['serious', label || 'unmet'], notchecked: ['neutral', label || 'not checked']
    }[kind] || ['neutral', label || kind];
    return c.verdict(m[0], m[1], { icon: { good: 'check', critical: 'x', serious: 'alert', warning: 'alert', info: 'info' }[m[0]] });
  }
  function para(t) { return '<p>' + esc(t) + '</p>'; }
  function lvlName(L) { return L + ' ' + ((E1.LEVELS[L] || {}).name || ''); }
  function sampleTag(t) { return '<span class="e1p-sample">' + c.icon('info', 12) + esc(t || 'Sample data') + '</span>'; }

  /* The portal band: organisation, access terms, tools, tabs. */
  function band(o) {
    var tabs = (o.tabs || []).map(function (t) {
      var on = t.id === o.active;
      return '<a href="' + esc(t.href) + '"' + (on ? ' aria-current="page"' : '') + '>' + (t.icon ? c.icon(t.icon, 14) : '') + '<span>' + esc(t.label) + '</span>' + (t.count !== undefined ? '<span class="e1-tab__count">' + esc(t.count) + '</span>' : '') + '</a>';
    }).join('');
    var vw = o.viewer || ['Visitor', 'No account'];
    var ini = String(vw[0]).replace(/^(CA|Dr|Mr|Ms|Mrs)\.?\s+/, '').split(/\s+/).filter(Boolean).slice(0, 2).map(function (w) { return w.charAt(0).toUpperCase(); }).join('');
    var hdr = '<div class="e1p-hdr" data-p-hdr hidden><span class="e1-envpill e1-envpill--sandbox" title="Every figure on this portal is sample data"><i aria-hidden="true"></i>Sample data</span>' +
      '<span class="e1p-hdr__user"><span class="e1p-hdr__text"><b>' + esc(vw[0]) + '</b><span>' + esc(vw[1]) + '</span></span><span class="e1p-hdr__av" aria-hidden="true">' + esc(ini || '·') + '</span></span></div>';
    return hdr + '<div class="e1p-band" role="region" aria-label="' + esc(o.portal) + ' context">' +
      '<div class="e1p-band__top"><div class="e1p-org"><span class="e1p-org__mark" aria-hidden="true">' + (o.markIcon ? c.icon(o.markIcon, 18) : esc(o.mark || '')) + '</span><div>' +
      '<div class="e1p-org__eyebrow">' + esc(o.eyebrow || 'Viewing as') + '</div>' +
      '<div class="e1p-org__name">' + esc(o.org) + '</div>' + (o.sub ? '<div class="e1p-org__sub">' + esc(o.sub) + '</div>' : '') + '</div></div>' +
      '<div class="e1p-tools">' + (o.tools || '') + '</div></div>' +
      (o.facts && o.facts.length ? '<div class="e1p-facts">' + o.facts.map(function (f) { return '<span class="e1p-fact">' + (f.icon ? c.icon(f.icon, 14) : '') + '<span>' + f.html + '</span></span>'; }).join('') + '</div>' : '') +
      (tabs ? '<nav class="e1p-nav" aria-label="' + esc(o.portal) + ' sections">' + tabs + '</nav>' : '') + '</div>';
  }
  /* Move the viewer block into the ink app bar (the bare layout's header), before the theme button. */
  document.addEventListener('e1:render', function () {
    try {
      var h = document.querySelector('[data-p-hdr]'), head = document.querySelector('.e1-bare__head');
      if (!h || !head) return;
      head.insertBefore(h, head.querySelector('[data-action="theme"]'));
      h.hidden = false;
    } catch (e) { /* cosmetic */ }
  });
  /* Level switch for the reviewer: which level the ISSUING organisation runs at. */
  function levelMenu(prefix) {
    return c.menu({
      label: (prefix || 'Issuer at') + ' ' + E1.state.level, icon: 'assurance', size: 'sm', align: 'right',
      items: ['L1', 'L2', 'L3'].map(function (L) { return { label: lvlName(L) + (L === 'L1' ? '' : ' · preview'), note: E1.LEVELS[L].claim, checked: E1.state.level === L, action: 'level', value: L }; })
    });
  }
  function statesMenu(items) {
    if (!items || !items.length) return '';
    return c.menu({ label: 'View states', icon: 'eye', size: 'sm', align: 'right', items: items.map(function (it) { return { label: it.label, href: it.href, note: it.note }; }) });
  }
  function sandboxTag() { return '<span class="e1-envtag e1-envtag--sandbox">Sample data</span>'; }
  function wrap(bandHtml, body) { return '<div class="e1p">' + bandHtml + body + '</div>'; }

  /* A locked explainer written for an outside reader (the issuer's level, not "your tenant"). */
  function portalLock(L, o) {
    o = o || {};
    if (E1.atLeast(L)) return '';
    var meta = E1.LEVELS[L];
    return '<section class="e1-locked" aria-label="' + esc(o.title) + '"><span class="e1-locked__icon" aria-hidden="true">' + c.icon('lock', 20) + '</span>' +
      '<div class="e1-locked__body"><div class="e1-locked__top">' + c.level(L) + '<span class="e1-caption e1-muted">' + esc(o.who || 'The issuing organisation') + ': ' + esc(lvlName(E1.state.level)) + ' today</span></div>' +
      '<h2 class="e1-locked__title">' + esc(o.title || ('This arrives at Assurance Level ' + L.slice(1) + ' ' + meta.name)) + '</h2>' +
      '<p class="e1-locked__why">' + esc(o.why || '') + '</p>' +
      (o.items && o.items.length ? '<ul class="e1-locked__items">' + o.items.map(function (x) { return '<li>' + c.icon('check', 12) + '<span>' + esc(x) + '</span></li>'; }).join('') + '</ul>' : '') +
      (o.today ? '<p class="e1p-note" style="margin-top:12px"><strong>What is true today.</strong> ' + esc(o.today) + '</p>' : '') +
      '<div class="e1-locked__actions">' + c.button('Preview as ' + L, { kind: 'secondary', icon: 'eye', attrs: 'data-action="level" data-value="' + L + '"' }) +
      (o.alt ? c.button(o.alt[0], { kind: 'ghost', href: o.alt[1], iconRight: 'arrow-right' }) : c.button('What each level lets you say', { kind: 'ghost', href: '#/assurance-levels', iconRight: 'arrow-right' })) + '</div></div></section>';
  }
  function previewNote(L, text) {
    if (E1.state.level === 'L1' || !E1.atLeast(L)) return '';
    return c.callout({ kind: 'caveat', title: 'Preview of ' + lvlName(L) + ' — illustrative dates and numbers.', body: '<p>' + esc(text || 'elan1 runs at Level 1 Guarded today. This screen shows how the portal reads once the issuing organisation has passed the ' + L + ' gate. Nothing here is a claim about a real engagement.') + '</p>' });
  }

  /* ------------------------------------------------------------------------
     Shared evidence data (E1.data.portals) — canonical names and ids
     ------------------------------------------------------------------------ */
  var LIMITS_MCA = 'A PASS under in-mca-audit-trail v1 establishes that the changes contained in this bundle were made through the elan1 governed write path, that each carries an actor, an actor kind, a target record identifier and a platform-clock timestamp, that the sequence is unbroken and externally anchored, and that the refused attempts are present. It does not establish that the books of account are complete: changes made directly in the accounting system, outside this write path, are recorded by that system\'s own audit trail and are not in this bundle. It does not establish that the transactions were genuine, that the rules applied were adequate, or that this bundle satisfies any obligation — that determination belongs to the reader. This profile is the vendor\'s reading of the obligation; it has not been reviewed or accepted by the Ministry of Corporate Affairs or by any regulator.';
  var RECEIPT_LIMITS = 'This establishes that the issuer\'s governed write path produced this record under these rules at this time. It does not establish that the underlying transaction occurred.';
  var FP_ACTIVE = 'ed25519:3f9a 1c07 … 8b2e';
  var FP_RELEASE = 'ed25519:1d8c 40a2 … e61f';

  var D = E1.data.portals = {
    tenant: { id: 'kaveri-spinning', name: 'Kaveri Spinning Mills Pvt Ltd', place: 'Tiruppur', tenantId: '7c1e2f90-4b1d-4e0a-9d52-5f3e8c21a04b', org: 'ar-org:kaverispinning.example', residency: 'in · Mumbai (ap-south-1)' },
    releases: [
      { v: '1.0.3', date: '2027-12-22', status: 'current', digest: dig('0d7c', '55a1'), seq: 1311, note: 'Adds the first-failure line for anchor revocation data captured at anchor time.', vectors: '64 vectors · 28 negatives' },
      { v: '1.0.2', date: '2027-11-30', status: 'superseded', digest: dig('9b40', '71c2'), seq: 1287, superseded: '2028-02-02', note: 'Superseded on 2 February 2028: v1.0.2 accepted a duplicated odd Merkle node (NV-13). Runs made with it before that date should be repeated.', runs: 'Any run that reported Merkle inclusion passed on a batch with an odd leaf count.', vectors: '63 vectors · 27 negatives' },
      { v: '1.0.1', date: '2027-11-12', status: 'superseded', digest: dig('5e21', '0b9d'), seq: 1262, superseded: '2027-11-30', note: 'Superseded on 30 November 2027: the INCOMPLETE line did not name the missing lexicon digest.', runs: 'None — the verdict was correct; only the report wording changed.', vectors: '60 vectors · 26 negatives' },
      { v: '1.0.0', date: '2027-10-28', status: 'superseded', digest: dig('a811', 'c3e0'), seq: 1240, superseded: '2027-11-12', note: 'First release. Superseded on 12 November 2027 by v1.0.1.', runs: 'None.', vectors: '58 vectors · 24 negatives' }
    ],
    checks: [
      { id: 'C01', kind: 'structural', text: 'Every governed change to a book of account appears as a record', clause: 'Audit trail of each and every transaction', onFail: 'fail_profile' },
      { id: 'C02', kind: 'binding', text: 'Each record names who made the change and whether they were a person or software', clause: 'Audit trail of each and every transaction', onFail: 'fail_profile' },
      { id: 'C03', kind: 'binding', text: 'Each change identifies the record changed and the version written', clause: 'Creating an edit log of each change made in books of account', onFail: 'fail_profile' },
      { id: 'C04', kind: 'temporal', text: 'Each change carries the date it was made, from the platform clock', clause: 'Along with the date when such changes were made', onFail: 'fail_profile' },
      { id: 'C05', kind: 'integrity', text: 'The trail cannot have been disabled without detection', clause: 'The audit trail shall not be disabled', onFail: 'fail_integrity' },
      { id: 'C06', kind: 'temporal', text: 'The trail cannot have been silently truncated', clause: 'The audit trail shall not be disabled', onFail: 'fail_integrity' }
    ],
    steps: [
      'Recompute every preimage (sixteen fields, length-prefixed, domain elan1.proof.seal.v6)',
      'Recompute every digest (SHA-256)',
      'Verify every signature against keys.json windows and the fingerprint you supplied',
      'seq contiguity — starts where the manifest says and never skips',
      'prev_digest linkage — each record ties to the one before',
      'Merkle inclusion paths (RFC 6962) to each batch root',
      'Anchor token time precedes now (RFC 3161, two authorities)',
      'Resolve every declaration version and lexicon digest inside the bundle'
    ]
  };

  /* Exit codes (six codes, 0–5; code 0 has three verdict strings) — E15, verbatim */
  var CODES = [
    { slug: 'pass', exit: 0, verdict: 'PASS', state: 'good', means: 'Every integrity check passed and every profile check passed.', next: 'Rely on it within the limits statement.' },
    { slug: 'unbound', exit: 0, verdict: 'PASS — payload unbound', state: 'good', info: true, means: 'One or more records\' payload salts were destroyed under an erasure obligation. Chain intact, payload unbound.', next: 'Note it. This is not a failure and must never be printed as one.' },
    { slug: 'pass-l1', exit: 0, verdict: 'PASS — unsigned, assurance level 1', state: 'neutral', means: 'Structure and chain verified; signature, key-window and anchor checks not_applicable.', next: 'Treat as internal control evidence only. It is not third-party-checkable.' },
    { slug: 'fail-integrity', exit: 1, verdict: 'FAIL_INTEGRITY', state: 'critical', means: 'A digest, a chain link, a signature, an inclusion path or an anchor did not verify.', next: 'Stop. This is a forensic question, not a compliance question.' },
    { slug: 'fail-profile', exit: 2, verdict: 'FAIL_PROFILE', state: 'serious', means: 'Integrity is sound; a profile requirement is unmet.', next: 'The records are trustworthy and the bundle does not meet this regime\'s requirements. Two different findings.' },
    { slug: 'incomplete', exit: 3, verdict: 'INCOMPLETE', state: 'warning', means: 'A referenced declaration version, lexicon or anchor member is missing from the bundle.', next: 'Ask for a complete bundle. Do not treat as a failure of the records.' },
    { slug: 'unsupported', exit: 4, verdict: 'UNSUPPORTED', state: 'neutral', means: 'Unknown profile version or unknown domain string.', next: 'Obtain the matching verifier. Never interpret.' },
    { slug: 'usage', exit: 5, verdict: 'USAGE', state: 'neutral', means: 'Bad arguments, unreadable file.', next: 'Operator error.' }
  ];
  function code(slug) { for (var i = 0; i < CODES.length; i++) if (CODES[i].slug === slug) return CODES[i]; return null; }
  /* Menu labels never carry the FAIL string (the payload-unbound page must not show it anywhere). */
  var CODE_MENU = [
    ['pass', 'Code 0 · PASS'], ['pass-l1', 'Code 0 · unsigned, level 1 (neutral)'], ['unbound', 'Code 0 · payload unbound'],
    ['fail-integrity', 'Code 1 · integrity — altered'], ['fail-profile', 'Code 2 · profile — requirement unmet'], ['incomplete', 'Code 3 · incomplete — piece missing'],
    ['unsupported', 'Code 4 · unsupported'], ['usage', 'Code 5 · usage']
  ];

  var CMD = 'elan1-verify --bundle kaveri-ledger1-2027-07-01_2027-10-26.tar \\\n  --profile in-mca-audit-trail-v1.json \\\n  --key-fingerprint 3f9a1c07…8b2e';

  /* Sample reports (E15 §4.5 verifier runs), keyed by the code slug. */
  var REPORTS = {
    'pass': {
      bundle: 'kaveri-ledger1-2027-07-01_2027-10-26.tar', claim: 'in-mca-audit-trail v1 · rule_as_at 2023-04-01 · bundle claims seq 41,207–53,686 · tenant 7c1e…a04b',
      scope: 'seq 41,207–53,686 · 12,480 records · 611 refusals · 6 of 6 write types · continuity scope full_chain · positioned inside a chain whose genesis digest is e3b7…41c9',
      steps: ['passed', 'passed', 'passed', 'passed', 'passed', 'passed', 'passed', 'passed'],
      stepNotes: { 2: '1 key, window ok', 5: '12,458 records in 818 batches; 1 single_anchor batch' },
      clauses: 'passed', first: null,
      notes: ['22 records unanchored at export time', '1 batch single_anchor (b_20271021_0915_7c1e) — a degraded state, not a failure', 'no key rotation spanned', 'no payloads unbound'],
      level: 'L2 · 12,480 records at Level 2 (seq 41,207–53,686)'
    },
    'unbound': {
      bundle: 'kaveri-ledger1-2027-07-01_2027-10-26-er.tar', claim: 'in-mca-audit-trail v1 · rule_as_at 2023-04-01 · bundle claims seq 41,207–53,686 · tenant 7c1e…a04b',
      scope: 'seq 41,207–53,686 · 12,480 records · 611 refusals · 6 of 6 write types · continuity scope full_chain',
      steps: ['passed', 'passed', 'passed', 'passed', 'passed', 'passed', 'passed', 'passed'], stepNotes: { 0: 'payload digests for 3 records are commitments whose salt was destroyed' },
      clauses: 'passed', first: null,
      notes: ['seq 44,019, 47,302, 50,881: chain intact, payload unbound (salt destroyed under erasure request ER-0193)', '22 records unanchored at export time'],
      level: 'L2 · 12,480 records at Level 2'
    },
    'pass-l1': {
      bundle: 'ref-tenant-l1-dryrun-fixture.tar', claim: 'in-mca-audit-trail v1 (dry run) · rule_as_at 2023-04-01 · bundle claims seq 1–10,000 · reference tenant (synthetic fixtures)',
      scope: 'seq 1–10,000 · 10,000 records · 1,184 refusals · 6 of 6 write types · continuity scope full_chain · assurance level 1 throughout',
      steps: ['passed', 'passed', 'na', 'passed', 'passed', 'na', 'na', 'passed'], clauses: 'l1', first: null,
      notes: ['No record in this bundle is signed or anchored. Signature, key-window and anchor checks were not applicable, not skipped.', 'L2 preparation — dry run against reference fixtures, not a tenant\'s records.'],
      level: 'L1 · 10,000 records at Level 1'
    },
    'fail-integrity': {
      bundle: 'elan1-tampered-bundle-v1.tar (published)', claim: 'in-mca-audit-trail v1 · rule_as_at 2023-04-01 · bundle claims seq 1–5,000 · tenant 00000000…0001 (published test tenant)',
      scope: 'seq 1–5,000 · 5,000 records · 412 refusals · 6 of 6 write types · continuity scope full_chain',
      steps: ['passed', 'passed', 'passed', 'passed', 'failed', 'passed', 'passed', 'passed'], stepNotes: { 4: '1 record' },
      clauses: 'notrun', first: 'FAIL at seq 3,181: prev_digest mismatch, expected a376… got 0000…\n  record  seq 3,181 · sales_invoice.submit · recorded_at 2027-03-02T10:14:09Z\n  field   F03 prev_digest\n  expected a3764c1e…9d0b52f7 (digest of seq 3,180)\n  found    00000000…00000000',
      notes: ['Profile checks were not evaluated: a clause result over altered records would mean nothing.', 'This is the published tampered bundle. Seeing this output is the point of it.'],
      level: 'L2 · 5,000 records at Level 2'
    },
    'fail-profile': {
      bundle: 'kaveri-ledger1-2027-04-01_2027-06-30-v6.tar', claim: 'in-mca-audit-trail v1 · rule_as_at 2023-04-01 · bundle claims seq 22,410–31,902 · tenant 7c1e…a04b',
      scope: 'seq 22,410–31,902 · 9,493 records · 0 refusals · 6 of 6 write types · continuity scope full_chain',
      steps: ['passed', 'passed', 'passed', 'passed', 'passed', 'passed', 'passed', 'passed'], clauses: 'c01', first: 'C01 structural — every governed change to a book of account appears as a record\n  requirement  refusals_required: true\n  found        refusal_count 0 across 9,493 records\n  context      budget gate disabled on journal_entry.submit at declaration v6',
      notes: ['Integrity is sound: nothing in this bundle was altered.', 'This is a conversation about controls and scope, not about tampering.'],
      level: 'L2 · 9,493 records at Level 2'
    },
    'incomplete': {
      bundle: 'kaveri-ledger1-2027-08-12_2027-09-30.tar', claim: 'in-mca-audit-trail v1 · rule_as_at 2023-04-01 · bundle claims seq 41,207–47,118 · tenant 7c1e…a04b',
      scope: 'seq 41,207–47,118 · 5,912 records · 288 refusals · 6 of 6 write types · continuity scope full_chain',
      steps: ['passed', 'passed', 'passed', 'passed', 'passed', 'passed', 'passed', 'missing'], clauses: 'notrun', first: 'Missing member: declarations/(9a41…, 8)\n  referenced by 3,904 records (first at seq 43,002)\n  the bundle manifest lists 2 of the 3 declaration versions it needs',
      notes: ['The records that could be checked verified. The bundle is missing a piece; the records are not accused of anything.'],
      level: 'L2 · 5,912 records at Level 2'
    },
    'unsupported': {
      bundle: 'kaveri-ledger1-2028-q1.tar', claim: 'in-mca-audit-trail v3 · bundle claims seq 58,001–71,003 · tenant 7c1e…a04b',
      scope: 'Not established — the verifier stops before reading records it cannot interpret.',
      steps: ['notrun', 'notrun', 'notrun', 'notrun', 'notrun', 'notrun', 'notrun', 'notrun'], clauses: 'notrun', first: 'Unknown profile version: in-mca-audit-trail v3\n  this verifier (v1.0.3) supports in-mca-audit-trail v1\n  obtain the verifier release that lists v3, from your own source',
      notes: ['Nothing was interpreted. An unknown profile is never guessed at.'], level: 'Not read'
    },
    'usage': {
      bundle: '—', claim: 'Not read.', scope: 'Not read — the command was not understood.',
      steps: ['notrun', 'notrun', 'notrun', 'notrun', 'notrun', 'notrun', 'notrun', 'notrun'], clauses: 'notrun', first: 'Unknown argument --bundel\n  did you mean --bundle?\n  usage: elan1-verify --bundle <path> --profile <path> --key-fingerprint <hex>',
      notes: ['Operator error. Nothing about any record is implied.'], level: 'Not read'
    }
  };
  /* Sample report files, as the reader's verifier names them. */
  var REPORT_IDS = {
    'EB-2027-0007': 'pass', 'RC-78412': 'pass', 'RC-78455': 'pass', 'EB-2027-0009': 'unbound', 'REF-L1-DRYRUN': 'pass-l1',
    'TAMPERED-V1': 'fail-integrity', 'RC-78299': 'fail-integrity', 'EB-2027-0004': 'fail-profile', 'EB-2027-0006': 'incomplete', 'EB-2028-0002': 'unsupported'
  };

  /* ==========================================================================
     PUBLIC VERIFIER  (/verify…)
     ========================================================================== */
  var VERIFY_TABS = [
    { id: 'home', label: 'Verify offline', href: '#/verify', icon: 'terminal' },
    { id: 'result', label: 'Read a report', href: '#/verify/result', icon: 'file-text' },
    { id: 'codes', label: 'Exit codes', href: '#/verify/exit-codes', icon: 'list' },
    { id: 'releases', label: 'Releases', href: '#/verify/releases', icon: 'package' },
    { id: 'tampered', label: 'Tampered bundle', href: '#/verify/tampered', icon: 'alert' },
    { id: 'fingerprints', label: 'Fingerprints', href: '#/verify/fingerprints', icon: 'fingerprint' },
    { id: 'guide', label: 'Report guide', href: '#/verify/report-guide', icon: 'book' }
  ];
  function verifyBand(active, states) {
    return band({
      portal: 'Public verifier', markIcon: 'globe', viewer: ['Anonymous reader', 'No account · nothing sent'], eyebrow: 'Viewing as', org: 'You — no account, no sign-in',
      sub: 'This page sends nothing to elan1. It explains the offline verifier and reads the report your copy writes.',
      facts: [
        { icon: 'lock', html: 'No cookies, no upload, no telemetry' },
        { icon: 'rupee', html: 'The verifier is free, ships as source, to anyone — <strong>₹0</strong>' },
        { icon: 'package', html: 'Latest release <a class="e1-mono" href="#/verify/releases/1.0.3">v1.0.3</a>' }
      ],
      tools: statesMenu(states) + sandboxTag(),
      tabs: VERIFY_TABS, active: active
    });
  }
  function codeTable(o) {
    o = o || {};
    return c.table({
      caption: 'Verifier exit codes', dense: o.dense,
      columns: [
        { key: 'exit', label: 'Code', mono: true, width: '64px' },
        { key: 'verdict', label: 'Verdict (as printed)', render: function (r) { return '<code class="e1-mono">' + esc(r.verdict) + '</code>'; } },
        { key: 'state', label: 'Status', render: function (r) { return c.badge(r.state, { good: r.info ? 'Pass · note' : 'Pass', neutral: r.exit === 0 ? 'Neutral' : 'Neutral', critical: 'Critical', serious: 'Serious', warning: 'Warning' }[r.state]); } },
        { key: 'means', label: 'Means' },
        { key: 'next', label: 'What the reader does' },
        { key: 'open', label: 'Sample report', render: function (r) { return '<a href="#/verify/result?code=' + r.slug + '">Open</a>'; } }
      ],
      rows: CODES
    });
  }

  E1.route('/verify', {
    title: 'Verify an elan1 bundle offline', layout: 'bare', bareTitle: 'Public verifier', keywords: 'verify offline verifier bundle fingerprint exit codes public',
    render: function (p, q) {
      var hero = c.pageHeader({
        eyebrow: 'Public verifier · any level · no account',
        title: 'Check an elan1 evidence bundle yourself — offline, with no account.',
        lead: 'The verifier is free, ships as source, has no dependencies, and we publish a deliberately tampered bundle so you can watch it refuse. There is no upload box on this page, on purpose: our code and our network must not sit in your verification path.',
        actions: c.button('Watch it refuse', { kind: 'ghost', icon: 'alert', href: '#/verify/tampered' }) + c.button('Read a report', { icon: 'file-text', href: '#/verify/result' }) + c.button('Get the verifier', { kind: 'primary', icon: 'download', href: '#/verify/releases' }),
        meta: c.honesty('₹0') + '<span>Free to anyone, as source</span>' + c.tag('elan1-verify v1.0.3') + '<span>Reads no network · calls no API · records nothing</span>'
      });
      var reads = c.card({
        title: 'What the verifier reads — and nothing else', eyebrow: 'Inputs',
        body: '<ul class="e1p-facts-list">' +
          [['package', 'The bundle\'s eight members, from a directory that needs nothing from us'], ['file-text', 'The profile document you choose to check it against'], ['fingerprint', 'A key fingerprint, out of band, from your own source'], ['clock', 'Your local clock — only to check the anchor time precedes now']].map(function (x) { return '<li>' + c.icon(x[0], 16) + '<span>' + esc(x[1]) + '</span></li>'; }).join('') + '</ul>',
        footer: '<span>It reads no network, calls no API, and shares no code with the chain writer. It does not refuse, it reports — and it records nothing.</span>'
      });

      var today = E1.state.level === 'L1' ? c.callout({ kind: 'caveat', title: 'What exists today.', body: '<p>elan1 runs at Level 1 Guarded. Level 1 records are hash-chained, not signed, so there is no bundle a stranger can check yet. The verifier, its vectors and the tampered bundle are published at the Level 2 gate: <em>a real customer\'s write verifies offline</em>. This page shows how verification works so you can plan for it — and hold us to it.</p>' }) + '<div class="e1p-gap"></div>' : '';

      var steps = '<ol class="e1p-steps">' +
        '<li><div><h3>Get the verifier from somewhere other than the bundle</h3><p>Download a release, install it from the independent registry, or build it from source. Check the download against <code>SHA256SUMS</code> and the release signature against the release-key fingerprint you obtained separately.</p>' +
        '<div class="e1-row" style="gap:8px;flex-wrap:wrap">' + c.button('Releases and checksums', { size: 'sm', icon: 'package', href: '#/verify/releases' }) + c.button('Build it yourself', { size: 'sm', kind: 'ghost', icon: 'code', href: '#/verify/releases/1.0.3', attrs: '' }) + '</div></div></li>' +
        '<li><div><h3>Obtain the key fingerprint from your own source</h3><p>Get the fingerprint from your own source, not from the bundle and not from this page alone — a signed notice you were given, a DNS record you resolve yourself, or a printed page handed to you at onboarding. The verifier never pre-fills it.</p>' + c.button('How fingerprints reach you', { size: 'sm', kind: 'ghost', icon: 'fingerprint', href: '#/verify/fingerprints' }) + '</div></li>' +
        '<li><div><h3>Disconnect, then run one command</h3><p>An air-gapped machine is the honest test. The verifier echoes the claim first — range, counts, profile, scope — then runs eight integrity steps and the profile checks.</p>' + c.code(CMD, 'shell', { title: 'Terminal · offline' }) + '</div></li>' +
        '<li><div><h3>Read the nine-section report and its exit code</h3><p>Six codes, 0 to 5. Codes 1, 2 and 3 are three different findings and must never be merged into a generic “failed”. Section 8, the limits, is what makes sections 1 to 7 credible.</p>' +
        '<div class="e1-row" style="gap:8px;flex-wrap:wrap">' + c.button('All exit codes', { size: 'sm', icon: 'list', href: '#/verify/exit-codes' }) + c.button('An annotated report', { size: 'sm', kind: 'ghost', icon: 'book', href: '#/verify/report-guide' }) + '</div></div></li></ol>';

      var reader = c.card({
        title: 'Already ran it? Read the report here', eyebrow: 'Read, not verify',
        body: '<p class="e1p-note" style="margin:0 0 14px">Open the report file your verifier wrote, or type the id it is named after. The file is read in this tab; nothing leaves your machine, and elan1 keeps no copy of any report — so it cannot look one up for you.</p>' +
          '<form class="e1-stack" data-p-form="readreport" novalidate>' +
          c.field('Report file name or receipt id', c.input({ id: 'p-rid', mono: true, placeholder: 'e.g. EB-2027-0007 or RC-78412', attrs: 'autocomplete="off" spellcheck="false"', describedBy: 'p-rid-msg' }), { id: 'p-rid', help: 'Sample set: EB-2027-0007 · RC-78412 · EB-2027-0009 · TAMPERED-V1 · EB-2027-0004 · EB-2027-0006 · REF-L1-DRYRUN' }) +
          '<label class="e1p-drop" data-p-drop><span class="e1p-rows__icon">' + c.icon('upload', 16) + '</span><span class="e1p-rows__main"><span class="e1p-rows__t">Or choose a report file</span><span class="e1p-rows__d" style="display:block">report-*.txt written by elan1-verify · read locally with the File API</span></span><input type="file" id="p-rfile" accept=".txt,.json,.log" aria-label="Choose a verifier report file"><span class="e1-btn e1-btn--secondary e1-btn--sm" aria-hidden="true"><span>Choose file</span></span></label>' +
          '<div class="e1-row" style="gap:8px">' + c.button('Read report', { kind: 'primary', type: 'submit', icon: 'file-text' }) + '<span class="e1p-note">Press <kbd class="e1-kbd">/</kbd> to jump here.</span></div></form>'
      });

      var routes = c.section({
        id: 'routes', title: 'Four ways to trust the verifier — the last one matters most', lead: 'A verifier we supply is a convenience; the format is the product.',
        body: '<div class="e1p-grid e1p-grid--4">' + [
          ['1', 'Compare the digests', 'Compare the SHA-256 of your download against SHA256SUMS, and the release signature against the release-key fingerprint obtained out of band.'],
          ['2', 'Rebuild from source', 'Pinned toolchain, SOURCE_DATE_EPOCH, empty lockfile. Two machines produce byte-identical builds; so should yours.'],
          ['3', 'Read the source', 'Standard library only, and small enough to read in a day.'],
          ['4', 'Write your own', 'Implement the seal (E12) and profile (E13) specifications yourself. The strongest thing you can do with this is not use our software.']
        ].map(function (x) { return '<div class="e1p-panel"><p class="e1-label">Route ' + x[0] + '</p><h3>' + esc(x[1]) + '</h3><p>' + esc(x[2]) + '</p></div>'; }).join('') + '</div>'
      });

      var codesSec = c.section({ id: 'codes', title: 'What the exit code means', lead: 'Every verdict names what happened, who has a problem and your next move.', actions: c.button('The three failures never to confuse', { size: 'sm', kind: 'ghost', href: '#/verify/exit-codes', iconRight: 'arrow-right' }), body: codeTable({ dense: true }) });

      var why = c.callout({ kind: 'rule', title: 'Why there is no “drop your bundle here” box.', body: '<p>An in-browser check would put elan1\'s code and elan1\'s network in the path of a verification meant to work without us. If a convenience page is ever offered, it will be a downloadable, reproducible static file with no network access — and it will say which verifier build it embeds.</p>' });

      return wrap(verifyBand('home', [{ label: 'Level 1 view (what exists today)', href: '#/verify', note: 'Use the band\'s level menu on other portals' }, { label: 'Open a sample PASS report', href: '#/verify/result?code=pass' }]),
        hero + today + '<div class="e1p-main-side"><div>' + c.section({ id: 'how', title: 'How to verify, in four steps', lead: 'Nothing here needs an elan1 account, and nothing reports back to us.', body: steps }) + '</div><div class="e1-stack">' + reads + reader + c.card({ title: 'See it refuse', eyebrow: 'Known-tampered', body: '<p class="e1p-note" style="margin:0 0 12px">A verifier nobody has watched refuse is not a verifier. We publish a bundle with one altered record and let the verifier name it.</p>' + c.button('Open the tampered bundle', { icon: 'alert', href: '#/verify/tampered', full: true }) }) + '</div></div>' +
        routes + codesSec + why);
    },
    mount: function (el) { mountReader(el); }
  });

  function mountReader(el) {
    var form = sel('[data-p-form="readreport"]', el);
    if (!form) return;
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var inp = sel('#p-rid', el), v = String(inp.value || '').trim().toUpperCase().replace(/^REPORT-/, '').replace(/\.TXT$/, '');
      if (!v) { showFieldError(inp, 'Type a report file name or receipt id, or choose the file your verifier wrote.'); return; }
      var slug = REPORT_IDS[v];
      if (!slug) { showFieldError(inp, 'No report named “' + v + '” in this sample set. elan1 keeps no copy of reports — open the file your verifier wrote instead.'); return; }
      E1.go('/verify/result', { code: slug, id: v });
    });
    var file = sel('#p-rfile', el), drop = sel('[data-p-drop]', el);
    if (file) file.addEventListener('change', function () { if (file.files && file.files[0]) readReportFile(file.files[0]); });
    if (drop) {
      drop.addEventListener('dragover', function (e) { e.preventDefault(); drop.classList.add('is-over'); });
      drop.addEventListener('dragleave', function () { drop.classList.remove('is-over'); });
      drop.addEventListener('drop', function (e) { e.preventDefault(); drop.classList.remove('is-over'); var f = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0]; if (f) readReportFile(f); });
    }
  }
  function showFieldError(inp, msg) {
    var fld = inp.closest('.e1-field'); if (!fld) return;
    fld.classList.add('is-invalid'); inp.setAttribute('aria-invalid', 'true');
    var m = sel('#' + inp.id + '-msg', fld);
    if (m) { m.className = 'e1-field__error'; m.setAttribute('role', 'alert'); m.innerHTML = c.icon('alert', 12) + '<span>' + esc(msg) + '</span>'; }
    inp.focus();
  }
  function readReportFile(f) {
    var name = String(f.name || '').toUpperCase();
    var guess = null;
    Object.keys(REPORT_IDS).forEach(function (k) { if (name.indexOf(k) >= 0) guess = REPORT_IDS[k]; });
    var done = function (slug) {
      if (!slug) { E1.toast('That file does not look like an elan1-verify report. Nothing was sent anywhere.', 'neutral', { title: 'Not a verifier report' }); return; }
      E1.toast('Read in this tab. Nothing was uploaded.', 'info', { title: 'Report opened: ' + f.name });
      E1.go('/verify/result', { code: slug, id: f.name });
    };
    if (guess) return done(guess);
    try {
      var r = new FileReader();
      r.onload = function () {
        var t = String(r.result || '').slice(0, 20000), m = /exit[^0-9]{0,6}([0-5])/i.exec(t), slug = null;
        if (/payload unbound/i.test(t)) slug = 'unbound';
        else if (/unsigned, assurance level 1/i.test(t)) slug = 'pass-l1';
        else if (/FAIL_INTEGRITY/.test(t)) slug = 'fail-integrity';
        else if (/FAIL_PROFILE/.test(t)) slug = 'fail-profile';
        else if (/INCOMPLETE/.test(t)) slug = 'incomplete';
        else if (/UNSUPPORTED/.test(t)) slug = 'unsupported';
        else if (m) slug = ['pass', 'fail-integrity', 'fail-profile', 'incomplete', 'unsupported', 'usage'][Number(m[1])];
        else if (/\bPASS\b/.test(t)) slug = 'pass';
        done(slug);
      };
      r.onerror = function () { done(null); };
      r.readAsText(f);
    } catch (e) { done(null); }
  }

  /* ---- The nine-section report ------------------------------------------ */
  function verdictBlock(k, o) {
    o = o || {};
    var cls = k.info ? 'good' : k.state;
    return '<section class="e1p-verdict e1p-verdict--' + cls + '" aria-label="Verdict">' +
      '<div class="e1p-verdict__code">' + k.exit + '<small>Exit code</small></div>' +
      '<div><div class="e1p-verdict__line"><span>' + esc(k.verdict) + '</span>' + c.badge(k.state, { good: 'Pass', neutral: 'Neutral', critical: 'Critical', serious: 'Serious', warning: 'Warning' }[k.state]) + (k.info ? c.badge('info', 'Note, not a failure', { subtle: true }) : '') + '</div>' +
      '<p class="e1p-verdict__means">' + esc(k.means) + '</p><p class="e1p-verdict__next"><strong>What you do:</strong> ' + esc(k.next) + '</p>' + (o.extra || '') + '</div></section>';
  }
  function rsec(nn, title, body, note, anno) {
    return '<section class="e1p-rsec" aria-labelledby="rs-' + nn + '"><header class="e1p-rsec__head"><span class="e1p-rsec__n">' + nn + '</span><h2 class="e1p-rsec__t" id="rs-' + nn + '">' + esc(title) + '</h2>' + (note ? '<span class="e1p-rsec__note">' + esc(note) + '</span>' : '') + '</header><div class="e1p-rsec__body">' + body + (anno ? '<div class="e1p-anno">' + c.icon('info', 14) + '<span>' + esc(anno) + '</span></div>' : '') + '</div></section>';
  }
  function reportHtml(slug, o) {
    o = o || {};
    var k = code(slug), r = REPORTS[slug], A = o.anno || {};
    var stepsTbl = c.table({
      caption: 'Integrity results', dense: true,
      columns: [{ key: 'n', label: '#', mono: true, width: '40px' }, { key: 't', label: 'Integrity step' }, { key: 'r', label: 'Result', html: true, nowrap: true }, { key: 'note', label: 'Detail' }],
      rows: D.steps.map(function (t, i) {
        var s = r.steps[i];
        return { n: i + 1, t: t, r: s === 'na' ? res('na') : s === 'notrun' ? res('notrun') : s === 'missing' ? res('missing', 'incomplete') : res(s), note: (r.stepNotes && r.stepNotes[i]) || '' };
      })
    });
    var clauseRows = D.checks.map(function (ch) {
      var st = r.clauses === 'passed' ? res('passed') : r.clauses === 'notrun' ? res('notrun') : r.clauses === 'l1' ? (ch.id === 'C06' ? res('na') : res('passed')) : r.clauses === 'c01' ? (ch.id === 'C01' ? res('unmet', 'unmet — profile') : res('passed')) : res('notrun');
      return { id: ch.id, kind: ch.kind, text: ch.text, onFail: ch.onFail, st: st };
    });
    var clauseTbl = c.table({ caption: 'Clause results', dense: true, columns: [{ key: 'id', label: 'Check', mono: true, width: '60px' }, { key: 'kind', label: 'Kind', mono: true }, { key: 'text', label: 'Statement' }, { key: 'st', label: 'Result', html: true, nowrap: true }], rows: clauseRows });
    var first = r.first ? '<pre class="e1p-first">' + esc(r.first) + '</pre>' : '<p>None.</p>';
    var repro = c.code('elan1-verify --bundle ' + (r.bundle === '—' ? '<path>' : r.bundle.replace(' (published)', '')) + ' \\\n  --profile in-mca-audit-trail-v1.json \\\n  --key-fingerprint 3f9a1c07…8b2e\n\nverifier     v1.0.3  (0d7c…55a1)\nprofile      in-mca-audit-trail v1  (aa60…31f2)\nbundle       4be1…90cf', 'shell', { title: 'Reproduce this run' });
    var limitsNote = slug === 'pass-l1' ? 'Reproduced verbatim from the profile. At level 1 the “externally anchored” clause of this statement is not met; the verdict line above says so.' : 'Reproduced verbatim from the profile, in every report.';
    return '<div class="e1p-report">' +
      rsec(1, 'Verdict', verdictBlock(k), 'exit ' + k.exit, A[1]) +
      rsec(2, 'The claim', para(r.claim), 'echoed before any check', A[2]) +
      rsec(3, 'Scope', para(r.scope) + '<p class="e1p-note">' + esc(r.level) + '</p>', 'a result without scope is a defect', A[3]) +
      rsec(4, 'Integrity results', stepsTbl, '8 steps', A[4]) +
      rsec(5, 'Clause results', clauseTbl, '4 clauses · C01–C06', A[5]) +
      rsec(6, 'First failure, in full', first, 'seq · field · expected · found', A[6]) +
      rsec(7, 'Notes', '<ul style="margin:0;padding-left:18px;line-height:1.6">' + r.notes.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul>', null, A[7]) +
      rsec(8, 'Limits', '<blockquote class="e1p-quote">' + esc(LIMITS_MCA) + '<cite>limits_statement · in-mca-audit-trail v1 · ' + esc(limitsNote) + '</cite></blockquote>', 'never collapsed', A[8]) +
      rsec(9, 'Reproduction', repro, null, A[9]) + '</div>';
  }

  E1.route('/verify/result', {
    title: function (p, q) { var k = code(q.code); return k ? 'Report: ' + k.verdict : 'Read a verifier report'; }, layout: 'bare', bareTitle: 'Public verifier',
    keywords: 'verification report result pass fail integrity profile incomplete exit code',
    render: function (p, q) {
      var states = CODE_MENU.map(function (x) { return { label: x[1], href: '#/verify/result?code=' + x[0] }; });
      if (!q.code) {
        return wrap(verifyBand('result', states), c.pageHeader({ title: 'Read a verifier report', eyebrow: 'Public verifier', lead: 'Open the report your offline verifier wrote. It is read in this tab; nothing is sent to elan1, and elan1 keeps no copy.' }) +
          '<div class="e1p-main-side"><div>' + c.card({ title: 'Open a report', body: '<form class="e1-stack" data-p-form="readreport" novalidate>' + c.field('Report file name or receipt id', c.input({ id: 'p-rid', mono: true, placeholder: 'e.g. EB-2027-0007', attrs: 'autocomplete="off" spellcheck="false"', describedBy: 'p-rid-msg' }), { id: 'p-rid', help: 'Sample set: EB-2027-0007 · RC-78412 · EB-2027-0009 · TAMPERED-V1 · EB-2027-0004 · EB-2027-0006 · REF-L1-DRYRUN' }) +
            '<label class="e1p-drop" data-p-drop><span class="e1p-rows__icon">' + c.icon('upload', 16) + '</span><span class="e1p-rows__main"><span class="e1p-rows__t">Or choose a report file</span><span class="e1p-rows__d" style="display:block">report-*.txt · read locally</span></span><input type="file" id="p-rfile" accept=".txt,.json,.log" aria-label="Choose a verifier report file"><span class="e1-btn e1-btn--secondary e1-btn--sm" aria-hidden="true"><span>Choose file</span></span></label>' +
            c.button('Read report', { kind: 'primary', type: 'submit', icon: 'file-text' }) + '</form>' }) +
          c.section({ id: 'samples', title: 'Or open a sample report for each verdict', body: '<ul class="e1p-rows">' + CODE_MENU.map(function (x) { var k = code(x[0]); return '<li><span class="e1p-rows__icon">' + c.icon('file-text', 16) + '</span><div class="e1p-rows__main"><p class="e1p-rows__t e1-mono">' + esc(k.exit + ' ' + k.verdict) + '</p><p class="e1p-rows__d">' + esc(k.means) + '</p></div><div class="e1p-rows__r">' + c.badge(k.state, { good: 'Pass', neutral: 'Neutral', critical: 'Critical', serious: 'Serious', warning: 'Warning' }[k.state], { subtle: true }) + c.button('Open', { size: 'sm', href: '#/verify/result?code=' + x[0] }) + '</div></li>'; }).join('') + '</ul>' }) +
          '</div><div class="e1-stack">' + c.callout({ kind: 'info', title: 'This page reads; it does not verify.', body: '<p>Verification happened on your machine when you ran elan1-verify. This page lays the report out in its nine sections so it is easier to read and to hand to a colleague.</p>' }) + c.card({ title: 'Did not run it yet?', body: '<p class="e1p-note" style="margin:0 0 12px">Start with the verifier and a fingerprint from your own source.</p>' + c.button('How to verify offline', { href: '#/verify', icon: 'terminal', full: true }) }) + '</div></div>');
      }
      var k = code(q.code);
      if (!k) {
        return wrap(verifyBand('result', states), c.pageHeader({ title: 'We could not read that report', eyebrow: 'Public verifier' }) + c.error({ title: 'The code “' + q.code + '” is not one the verifier prints.', body: 'The verifier exits with one of six codes, 0 to 5. A report with any other code was not written by elan1-verify, or was edited after it was written.', reassurance: 'Nothing was sent to elan1 and nothing was recorded.', action: [{ label: 'Open a report again', href: '#/verify/result' }, { label: 'All exit codes', href: '#/verify/exit-codes' }] }));
      }
      var src = q.id ? 'Report file: ' + q.id : 'Sample report';
      var header = c.pageHeader({
        title: k.verdict, eyebrow: 'Verifier report · read in your browser',
        lead: REPORTS[q.code].bundle === '—' ? 'The command was not understood, so no bundle was read.' : 'Bundle ' + REPORTS[q.code].bundle + ' · checked by elan1-verify v1.0.3 on the reader\'s machine.',
        actions: c.button('Copy verdict line', { size: 'sm', icon: 'copy', attrs: 'data-copy="' + esc(k.exit + ' ' + k.verdict + ' · ' + REPORTS[q.code].scope) + '" data-copy-label="Verdict line"' }) + c.button('Print report', { size: 'sm', icon: 'file', attrs: 'data-action="p-print"' }) + c.button('Open another', { size: 'sm', kind: 'ghost', href: '#/verify/result' }),
        meta: '<span class="e1p-fact">' + c.icon('file-text', 14) + '<span>' + esc(src) + '</span></span><span class="e1p-fact">' + c.icon('lock', 14) + '<span>Submitted by the reader; elan1 did not run this and holds no copy.</span></span>'
      });
      var side = '<div class="e1-stack">' +
        (k.exit === 1 ? c.callout({ kind: 'critical', title: 'Integrity, not compliance.', body: '<p>FAIL_INTEGRITY means somebody\'s records were altered, or a signature is wrong. Whoever held the records has the problem. Do not negotiate it over email; preserve the exact bytes you received.</p>' }) : '') +
        (k.exit === 2 ? c.callout({ kind: 'warning', title: 'Not an accusation of tampering.', body: '<p>FAIL_PROFILE means an honest record set does not meet this regime\'s requirements. The conversation is about controls or scope — with whoever designed the controls or chose the scope.</p>' }) : '') +
        (k.exit === 3 ? c.callout({ kind: 'warning', title: 'A packaging problem.', body: '<p>Whoever built the export has the problem. Ask for a complete bundle. It is never reported as either failure.</p>' }) : '') +
        (q.code === 'unbound' ? c.callout({ kind: 'info', title: 'An erasure, recorded honestly.', body: '<p>Three payload salts were destroyed under an erasure obligation. The chain still verifies; those three payloads can no longer be bound to their records. This is a correct outcome and is printed as a pass.</p>' }) : '') +
        (q.code === 'pass-l1' ? c.callout({ kind: 'caveat', title: 'Internal control evidence only.', body: '<p>Level 1 records are hash-chained, not signed and not anchored. A pass at level 1 means the structure and chain hold; it is not something a third party can check without trusting the issuer.</p>' }) : '') +
        c.card({ title: 'Other verdicts', body: '<ul class="e1p-fields">' + CODE_MENU.filter(function (x) { return x[0] !== q.code; }).map(function (x) { return '<li><a href="#/verify/result?code=' + x[0] + '">' + esc(x[1]) + '</a></li>'; }).join('') + '</ul>' }) +
        c.card({ title: 'Check the verifier, too', body: '<p class="e1p-note" style="margin:0 0 12px">A report is only as good as the binary that wrote it. Compare its digest with SHA256SUMS from the release you trust.</p>' + c.button('Release v1.0.3', { href: '#/verify/releases/1.0.3', icon: 'package', full: true }) }) + '</div>';
      return wrap(verifyBand('result', states), header + '<div class="e1p-main-side"><div>' + reportHtml(q.code) + '</div>' + side + '</div>');
    },
    mount: function (el) { mountReader(el); }
  });
  E1.action('p-print', function () { try { window.print(); } catch (e) { E1.toast('Printing is not available here.', 'neutral'); } });

  E1.route('/verify/exit-codes', {
    title: 'Exit codes', layout: 'bare', bareTitle: 'Public verifier', keywords: 'exit codes pass fail_integrity fail_profile incomplete unsupported usage',
    render: function () {
      var three = '<div class="e1-table-wrap"><table class="e1-table"><caption class="e1-sr">The three failures a verifier must never confuse</caption><thead><tr><th scope="col"></th><th scope="col">Integrity failure (1)</th><th scope="col">Profile failure (2)</th><th scope="col">Incomplete (3)</th></tr></thead><tbody>' +
        [['What happened', 'The data was altered, or the signature is wrong', 'The data is sound; the regime\'s requirements are not met', 'The bundle is missing a piece'],
          ['Who has a problem', 'Whoever held the records', 'Whoever designed the controls, or chose the scope', 'Whoever built the export'],
          ['The reader\'s next move', 'Forensics', 'A conversation about controls', 'Ask for a complete bundle'],
          ['Reporting it as the wrong one', 'Accuses a customer of tampering', 'Hides a P0', 'Turns a packaging bug into an accusation']].map(function (r) { return '<tr><th scope="row">' + esc(r[0]) + '</th><td>' + esc(r[1]) + '</td><td>' + esc(r[2]) + '</td><td>' + esc(r[3]) + '</td></tr>'; }).join('') +
        '</tbody><tfoot><tr><th scope="row">Status</th><td>' + c.badge('critical', 'Critical') + '</td><td>' + c.badge('serious', 'Serious') + '</td><td>' + c.badge('warning', 'Warning') + '</td></tr></tfoot></table></div>';
      return wrap(verifyBand('codes', CODE_MENU.map(function (x) { return { label: x[1], href: '#/verify/result?code=' + x[0] }; })),
        c.pageHeader({ title: 'Exit codes', eyebrow: 'Public verifier', lead: 'Six codes, 0 to 5. Code 0 has three verdict strings. Every code says what happened and what you do next.' }) +
        c.section({ id: 'six', title: 'The six codes', body: codeTable() }) +
        c.section({ id: 'three', title: 'The three failures a verifier must never confuse', lead: '1 and 2 must never be collapsed. FAIL_INTEGRITY means somebody\'s records were altered. FAIL_PROFILE means an honest record set does not meet a regime\'s requirements. 3 is never reported as either.', body: three }) +
        '<div class="e1p-grid e1p-grid--3">' +
        '<div class="e1p-panel"><p class="e1-label">Erasure wording</p><h3>A destroyed salt is a pass with a note</h3><p>When a payload salt is destroyed under an erasure obligation, the verifier prints <code>PASS — payload unbound</code>. Profile conformance test P7 checks that the failure string appears nowhere in that report.</p></div>' +
        '<div class="e1p-panel"><p class="e1-label">Level 1 records</p><h3>Neutral, never a silent green</h3><p><code>PASS — unsigned, assurance level 1</code> means structure and chain verified while signature, key-window and anchor checks were not applicable. Treat it as internal control evidence.</p></div>' +
        '<div class="e1p-panel"><p class="e1-label">Withdrawn profiles</p><h3>Exit 4, with the date</h3><p>A bundle that claims a withdrawn profile exits <code>4 UNSUPPORTED</code> with the withdrawal date printed. A bundle is judged under the profile version it claims, not the current one.</p></div></div>');
    }
  });

  E1.route('/verify/releases', {
    title: 'Verifier releases', layout: 'bare', bareTitle: 'Public verifier', keywords: 'download verifier release checksums sha256sums signature reproducible build',
    render: function () {
      var cur = D.releases[0];
      var rows = D.releases.map(function (r) {
        return { v: r.v, date: fmt.date(r.date), status: r.status, digest: r.digest, seq: r.seq, vectors: r.vectors, note: r.note };
      });
      var tbl = c.table({
        caption: 'Verifier releases',
        columns: [
          { key: 'v', label: 'Version', mono: true, render: function (r) { return 'v' + esc(r.v); } },
          { key: 'date', label: 'Published' },
          { key: 'status', label: 'Status', render: function (r) { return r.status === 'current' ? c.badge('good', 'Current') : c.badge('warning', 'Superseded — never withdrawn'); } },
          { key: 'digest', label: 'SHA-256 (source tarball)', render: function (r) { return c.hash(r.digest, { label: 'Release digest' }); } },
          { key: 'vectors', label: 'Vector set' },
          { key: 'seq', label: 'Release record', render: function (r) { return '<span class="e1-mono">operator #' + n(r.seq) + '</span>'; } }
        ],
        rows: rows, rowHref: function (r) { return '#/verify/releases/' + r.v; }
      });
      return wrap(verifyBand('releases', [{ label: 'Current release', href: '#/verify/releases/1.0.3' }, { label: 'A superseded release', href: '#/verify/releases/1.0.2' }]),
        c.pageHeader({ title: 'Verifier releases', eyebrow: 'Public verifier · free, source, to anyone', lead: 'Every release is signed with an offline release key held by two named people, published here and on one independent registry, and recorded as a governed release in our operator chain.', actions: c.button('Download v' + cur.v, { kind: 'primary', icon: 'download', href: '#/verify/releases/' + cur.v }) }) +
        (E1.state.level === 'L1' ? c.callout({ kind: 'caveat', title: 'Sample release history.', body: '<p>Releases are published at the Level 2 gate. The versions, dates and digests below show the shape of the release page; they are not downloads today.</p>' }) + '<div class="e1p-gap"></div>' : '') +
        c.callout({ kind: 'warning', title: 'Superseded on 2 February 2028: v1.0.2 accepted a duplicated odd Merkle node (NV-13).', body: '<p>Runs made with it before that date should be repeated. Releases are superseded, never withdrawn silently; each carries a dated note and the runs it affects.</p>' }) + '<div class="e1p-gap"></div>' +
        tbl +
        '<div class="e1p-grid e1p-grid--3 e1p-mt">' +
        '<div class="e1p-panel"><p class="e1-label">Release key</p><h3 class="e1-mono" style="font-size:var(--text-body)">kr_2027_01</h3><p>Fingerprint <code>' + esc(FP_RELEASE) + '</code>. Obtain it out of band — from the printed notice or the independent registry — not from this page alone.</p></div>' +
        '<div class="e1p-panel"><p class="e1-label">Reproducible build</p><h3>Byte-identical on two machines</h3><p>Pinned toolchain digest, <code>SOURCE_DATE_EPOCH=1798156800</code>, an enforced empty lockfile. Rebuild and compare with SHA256SUMS.</p></div>' +
        '<div class="e1p-panel"><p class="e1-label">Price</p><h3>₹0, to anyone</h3><p>Including non-customers. A verifier behind a paywall is a verifier a sceptical auditor will not run.</p></div></div>');
    }
  });

  E1.route('/verify/releases/:version', {
    title: function (p) { return 'Verifier v' + p.version; }, layout: 'bare', bareTitle: 'Public verifier', example: '/verify/releases/1.0.3',
    render: function (p) {
      var r = null; D.releases.forEach(function (x) { if (x.v === p.version) r = x; });
      if (!r) {
        return wrap(verifyBand('releases'), c.pageHeader({ title: 'No release v' + p.version, eyebrow: 'Public verifier', back: ['All releases', '#/verify/releases'] }) +
          c.empty({ title: 'There is no verifier release with that version.', why: 'Releases are never deleted, so a version that is not listed here was never published by elan1. A binary claiming to be v' + p.version + ' did not come from us.', fill: 'Use a listed release, and check its digest against SHA256SUMS.', action: { label: 'All releases', href: '#/verify/releases' }, icon: 'package' }));
      }
      var files = [
        ['elan1-verify-' + r.v + '-linux-x86_64', '1.9 MB'], ['elan1-verify-' + r.v + '-linux-aarch64', '1.8 MB'], ['elan1-verify-' + r.v + '-macos-universal', '3.6 MB'], ['elan1-verify-' + r.v + '-windows-x86_64.exe', '2.1 MB'],
        ['elan1-verify-' + r.v + '-src.tar.gz', '96 KB'], ['vectors-' + r.v + '.tar.gz (' + r.vectors + ')', '4.2 MB'], ['elan1-tampered-bundle-v1.tar', '3.1 MB'], ['SHA256SUMS', '1 KB'], ['SHA256SUMS.sig', '64 B']
      ];
      var sums = files.slice(0, 7).map(function (f) { return hx(f[0] + r.v, 64) + '  ' + f[0].split(' ')[0]; }).join('\n');
      return wrap(verifyBand('releases'),
        c.pageHeader({ title: 'elan1-verify v' + r.v, eyebrow: 'Public verifier · release', back: ['All releases', '#/verify/releases'], lead: r.note,
          actions: c.button('Download for Linux', { kind: 'primary', icon: 'download', attrs: 'data-action="p-download" data-value="elan1-verify-' + esc(r.v) + '-linux-x86_64"' }),
          meta: (r.status === 'current' ? c.badge('good', 'Current') : c.badge('warning', 'Superseded ' + fmt.date(r.superseded))) + '<span class="e1p-fact">' + c.icon('calendar', 14) + '<span>Published ' + esc(fmt.date(r.date)) + '</span></span><span class="e1p-fact">' + c.icon('stamp', 14) + '<span>Release record operator #' + n(r.seq) + ' · approved under dual control</span></span>' }) +
        (r.status !== 'current' ? c.callout({ kind: 'warning', title: 'Runs affected.', body: '<p>' + esc(r.runs) + '</p>' }) + '<div class="e1p-gap"></div>' : '') +
        '<div class="e1p-main-side"><div>' +
        c.section({ id: 'files', title: 'Artefacts', body: c.table({ caption: 'Release artefacts', dense: true, columns: [{ key: 'f', label: 'File', mono: true }, { key: 's', label: 'Size', align: 'right' }, { key: 'd', label: '', align: 'right', html: true }], rows: files.map(function (f) { return { f: f[0], s: f[1], d: c.button('Download', { size: 'sm', kind: 'ghost', icon: 'download', attrs: 'data-action="p-download" data-value="' + esc(f[0]) + '"' }) }; }) }) }) +
        c.section({ id: 'sums', title: 'SHA256SUMS', body: c.code(sums, 'text', { title: 'SHA256SUMS · v' + r.v }) }) +
        c.section({ id: 'build', title: 'Build it yourself', body: c.code('git clone https://elan1.ai/verify.git && cd verify\ngit checkout v' + r.v + '\nexport SOURCE_DATE_EPOCH=1798156800\n./build.sh --toolchain-digest 5a0e…c417   # pinned\nsha256sum dist/*  # compare with SHA256SUMS', 'shell', { title: 'Reproducible build' }) }) +
        '</div><div class="e1-stack">' +
        c.card({ title: 'Check the signature', body: c.kv([['Release key', 'kr_2027_01', { mono: true }], ['Fingerprint', FP_RELEASE, { mono: true }], ['Held by', 'Offline hardware token, two named people, not in any cloud']], { compact: true }) + '<p class="e1p-note" style="margin-top:10px">Obtain it from your own source. If the fingerprint you were given differs from this one, trust yours and tell us.</p>' }) +
        c.card({ title: 'Second publication', body: '<p class="e1p-note" style="margin:0">The same artefacts, byte for byte, are published on one independent package registry. A mismatch between the two is a P0 and a reason not to run either.</p>' }) +
        c.card({ title: 'What this release reads', body: '<ul class="e1p-fields"><li><span>Network</span><span class="e1p-v">none</span></li><li><span>Dependencies</span><span class="e1p-v">0 · empty lockfile</span></li><li><span>Records it writes</span><span class="e1p-v">none</span></li><li><span>Price</span><span class="e1p-v">₹0</span></li></ul>' }) +
        '</div></div>');
    }
  });
  E1.action('p-download', function (el) {
    E1.toast(E1.state.level === 'L1' ? 'Sample release — nothing is downloaded in this prototype. Releases are published at the Level 2 gate.' : 'Prototype: no file is downloaded. Check any real download against SHA256SUMS.', 'info', { title: el.getAttribute('data-value') });
  });

  E1.route('/verify/tampered', {
    title: 'The tampered bundle', layout: 'bare', bareTitle: 'Public verifier', keywords: 'tampered bundle altered known-tampered negative vectors refuse',
    render: function (p, q) {
      var shown = q.reveal === '1';
      var out = '$ elan1-verify --bundle elan1-tampered-bundle-v1.tar \\\n    --profile in-mca-audit-trail-v1.json --key-fingerprint 7b20…c9d1\n\nclaim     in-mca-audit-trail v1 · seq 1–5,000 · 5,000 records · 412 refusals\nscope     full_chain · 6 of 6 write types · level 2 throughout\n\n[1/8] preimages ............ passed\n[2/8] digests .............. passed\n[3/8] signatures ........... passed (1 key, window ok)\n[4/8] seq contiguity ....... passed\n[5/8] prev_digest linkage .. FAILED\n\nFAIL at seq 3,181: prev_digest mismatch, expected a376… got 0000…\n\nexit 1  FAIL_INTEGRITY';
      var diffRows = [
        { field: 'seq', before: '3,181', after: '3,181', mono: true },
        { field: 'write_type', before: 'sales_invoice.submit', after: 'sales_invoice.submit', mono: true },
        { field: 'recorded_at', before: '2027-03-02T10:14:09Z', after: '2027-03-02T10:14:09Z', mono: true },
        { field: 'prev_digest (F03)', before: 'a3764c1e…9d0b52f7', after: '00000000…00000000', material: true, mono: true },
        { field: 'digest', before: '6e0f2a91…4c8d17b3', after: '6e0f2a91…4c8d17b3', mono: true }
      ];
      var reveal = shown ? c.section({ id: 'what', title: 'What was altered', lead: 'One field in one record. The verifier named it before you read this.', body: c.diff(diffRows, { caption: 'seals.jsonl, line 3,181 — published original against the tampered copy', collapse: false }) + '<p class="e1p-note" style="margin-top:10px">Everything else in the bundle is untouched, which is why steps 1 to 4 pass. A clause result over altered records would mean nothing, so profile checks are not evaluated.</p>' }) :
        '<div class="e1p-panel e1p-panel--sunken" style="text-align:center;padding:28px"><p class="e1-label">Not revealed up front</p><h3>Let the verifier tell you what changed</h3><p>Run it first. Then compare what it named with what we altered.</p>' + c.button('Reveal what was altered', { kind: 'secondary', icon: 'eye', href: '#/verify/tampered?reveal=1' }) + '</div>';
      return wrap(verifyBand('tampered', [{ label: 'Before you run it', href: '#/verify/tampered' }, { label: 'After — altered field revealed', href: '#/verify/tampered?reveal=1' }]),
        c.pageHeader({ title: 'Watch it refuse', eyebrow: 'Public verifier · known-tampered bundle', lead: 'A verifier nobody has watched refuse is not a verifier. This bundle has one altered record; the verifier should exit 1 FAIL_INTEGRITY naming the record and the field.',
          actions: c.button('Download the tampered bundle', { kind: 'primary', icon: 'download', attrs: 'data-action="p-download" data-value="elan1-tampered-bundle-v1.tar"' }) + c.button('Read its report', { icon: 'file-text', href: '#/verify/result?code=fail-integrity&id=TAMPERED-V1' }),
          meta: '<span class="e1p-fact">' + c.icon('hash', 14) + '<span>SHA-256 ' + c.hash(dig('7f31', 'b90a'), { label: 'Tampered bundle digest' }) + '</span></span><span class="e1p-fact">' + c.icon('info', 14) + '<span>Licensed CC0 · test tenant 00000000…0001 · signed with the published test key, not a production key</span></span>' }) +
        '<div class="e1p-grid e1p-grid--2">' +
        c.card({ title: 'Expected output', eyebrow: 'Offline · your machine', body: '<div class="e1p-term">' + c.code(out, 'shell', { title: 'Terminal' }) + '</div>' }) +
        '<div class="e1-stack">' + verdictBlock(code('fail-integrity'), { extra: '<p class="e1p-note" style="margin-top:8px">If your copy exits 0 on this bundle, stop using it and tell us — that is a defect in the verifier, and a P0.</p>' }) +
        c.card({ title: 'The rest of the negative vectors', body: '<p class="e1p-note" style="margin:0 0 10px">Each release ships 28 negative vectors. Every one must exit 1 and name the record and the field.</p><ul class="e1p-fields">' +
          [['NV-01', 'digest byte flipped', 'digest'], ['NV-05', 'seq skipped (3,180 → 3,182)', 'seq'], ['NV-09', 'signature from a retired key outside its window', 'signature'], ['NV-13', 'duplicated odd Merkle node', 'inclusion path'], ['NV-14', 'the two anchor tokens disagree about the root', 'anchor'], ['NV-21', 'lexicon digest points at an edited term set', 'lexicon_hash']].map(function (x) { return '<li><code>' + x[0] + '</code><span class="e1p-rows__d" style="flex:1">' + esc(x[1]) + '</span><code class="e1p-commit">' + esc(x[2]) + '</code></li>'; }).join('') + '</ul>' }) + '</div></div>' +
        '<div class="e1p-gap"></div>' + reveal);
    }
  });

  E1.route('/verify/fingerprints', {
    title: 'Key fingerprints', layout: 'bare', bareTitle: 'Public verifier', keywords: 'fingerprint out of band key discovery dev-do-not-trust',
    render: function () {
      return wrap(verifyBand('fingerprints'),
        c.pageHeader({ title: 'Key fingerprints, out of band', eyebrow: 'Public verifier', lead: 'Key discovery is a register problem, solved out of band. The fingerprint you pass to the verifier must come from your own source — never from the bundle, and never from this page alone.' }) +
        '<div class="e1p-grid e1p-grid--3">' + [
          ['mail', 'Signed notice', 'The notice contact at the organisation you are checking receives the fingerprint before any record is signed, and can forward the signed notice to you.'],
          ['globe', 'DNS record you resolve', 'A TXT record under the issuer\'s own domain, resolved by you, with your resolver. Moderate on its own; strong alongside a notice.'],
          ['file', 'Printed page', 'A page handed over at onboarding or at the audit opening meeting, signed by the issuer\'s owner. The oldest channel, and the hardest to intercept.']
        ].map(function (x) { return '<div class="e1p-panel"><span class="e1p-rows__icon" style="margin-bottom:10px">' + c.icon(x[0], 16) + '</span><h3>' + esc(x[1]) + '</h3><p>' + esc(x[2]) + '</p></div>'; }).join('') + '</div>' +
        c.section({ id: 'known', title: 'Fingerprints you may meet', lead: 'For recognition only. Pin the one your own source gave you.', body: c.table({ caption: 'Known fingerprints', columns: [{ key: 'id', label: 'key_id', mono: true }, { key: 'cls', label: 'Class' }, { key: 'fp', label: 'Fingerprint', mono: true }, { key: 'st', label: 'Status', html: true }, { key: 'note', label: 'Note' }], rows: [
          { id: 'k_in_20270701_4d7e', cls: 'Domain signing · in', fp: FP_ACTIVE, st: c.badge('good', 'Active'), note: 'Signs records for every tenant in residency domain in. One key per domain, not per tenant.' },
          { id: 'k_in_20270401_9c3a', cls: 'Domain signing · in', fp: 'ed25519:9c3a 51f0 … 02de', st: c.badge('neutral', 'Retired'), note: 'Still verifies within its window, 1 Apr – 1 Jul 2027.' },
          { id: 'k_inx_20270901_77e0', cls: 'Domain signing · inx', fp: 'ed25519:77e0 …', st: c.badge('serious', 'Revoked (drill)'), note: 'Records still verify; exclusivity ends at T_suspect 2027-10-03T02:11:00Z.' },
          { id: 'dev', cls: 'Development', fp: 'dev-DO-NOT-TRUST', st: c.badge('critical', 'Never trust'), note: 'Bundles signed with this key are development bundles. Treat any such bundle offered as evidence as a finding.' }
        ] }) }) +
        c.callout({ kind: 'rule', title: 'Revocation is not a verification failure.', body: '<p>Records signed by a revoked key still verify. They are no longer exclusive after the suspected time, and they are still anchored — all three statements are true at once.</p>' }));
    }
  });

  E1.route('/verify/report-guide', {
    title: 'How to read a verification report', layout: 'bare', bareTitle: 'Public verifier', keywords: 'report guide nine sections annotated sample',
    render: function () {
      var anno = {
        1: 'The exit code and the verdict line, exactly as printed. Status is carried by words, never by colour alone.',
        2: 'The verifier echoes what the bundle claims before checking anything — so you can see if it is the claim you were promised.',
        3: 'Range, counts, write types and continuity scope. A result without its scope is a defect in the report.',
        4: 'Eight steps, each passed, failed or not_applicable — assurance level 1. Nothing is silently skipped.',
        5: 'One row per check bound to a clause. Integrity checks and profile checks fail differently.',
        6: 'Always seq, field, expected and found. If this section says none, there was no failure.',
        7: 'Degraded but honest states live here: unanchored head, single_anchor batches, key rotations, unbound payloads.',
        8: 'Section 8 is what makes sections 1 to 7 credible. It is the profile\'s own words, reproduced verbatim, every time.',
        9: 'Enough to repeat the run exactly: the command, the verifier digest, the profile digest and the bundle digest.'
      };
      return wrap(verifyBand('guide'),
        c.pageHeader({ title: 'How to read a verification report', eyebrow: 'Public verifier · annotated sample', lead: 'Nine sections, in this order, every time. This is run 1 from the sample set: the Level 2 range of Kaveri Spinning Mills under in-mca-audit-trail v1.', actions: c.button('Open without notes', { size: 'sm', href: '#/verify/result?code=pass' }) }) +
        c.callout({ kind: 'rule', title: 'Section 8 is what makes sections 1 to 7 credible.', body: '<p>A pass means exactly what the limits statement says, and nothing more. Read it before you rely on the verdict.</p>' }) + '<div class="e1p-gap"></div>' +
        reportHtml('pass', { anno: anno }));
    }
  });

  /* "/" focuses the report reader on /verify pages. */
  document.addEventListener('keydown', function (e) {
    if (e.key !== '/' || e.ctrlKey || e.metaKey || e.altKey) return;
    var t = e.target, tag = t && t.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || (t && t.isContentEditable)) return;
    var inp = document.getElementById('p-rid') || document.getElementById('p-inbox-q');
    if (inp) { e.preventDefault(); inp.focus(); }
  });

  /* ==========================================================================
     AUDITOR PORTAL  (/auditor…) — read-only, time-boxed, every number links to evidence
     ========================================================================== */
  var AUD = D.auditor = {
    firm: 'Iyer Menon & Co., Chartered Accountants', mark: 'IM', person: 'CA Lakshmi Iyer', role: 'Engagement partner · statutory auditor',
    team: [{ name: 'CA Lakshmi Iyer', role: 'Engagement partner' }, { name: 'Deepa Srinivasan', role: 'Audit senior' }],
    eng: { id: 'ENG-2026-014', title: 'Statutory audit FY 2026-27 · interim visit', from: '2026-09-22T00:00:00+05:30', to: '2026-10-22T23:59:59+05:30', grantedBy: ['Meenakshi Iyer', 'Venkat Raman'], grantSeq: 4031 },
    head: 4112, checkedTo: 4089
  };
  /* Canonical proof entries #4,090–#4,112 (spec §4.6) — [seq, time, writeType, actor, kind, A, outcome, code/note, object, prevHead, prevTail, digHead, digTail] */
  var REC = [
    [4090, '10:02', 'erp.supplier.create', 'Priya Nair', 'person', 'A3', 'committed', '', 'Coimbatore Castings Pvt Ltd (33AAECC9120B1Z4)', '71e0', 'c2d9', 'a3f9', '5e2b'],
    [4091, '10:19', 'erp.purchase_invoice.submit', 'ap-agent', 'agent', 'A3', 'committed', '', 'ACC-PINV-2026-00541 · ₹1,86,440', 'a3f9', '5e2b', '0c7d', '91fa'],
    [4092, '10:44', 'erp.sales_invoice.submit', 'Invoice Agent', 'agent', 'A1', 'refused', 'GATE.COUNTERPARTY_UNKNOWN', 'Shree Ganesh Handlooms (unregistered)', '0c7d', '91fa', '5b12', 'e804'],
    [4093, '11:03', 'erp.purchase_order.submit', 'ap-agent', 'agent', 'A2', 'escalated', 'OB-2026-0409 · dual control above ₹5 lakh', 'PO-2026-00318 · ₹6,20,000', '5b12', 'e804', 'e9aa', '1370'],
    [4094, '11:21', 'platform.obligation.resolve', 'Venkat Raman', 'person', '', 'committed', 'approve · resolves OB-2026-0409', '—', 'e9aa', '1370', '2f64', 'a0cb'],
    [4095, '11:21', 'erp.purchase_order.submit', 'ap-agent', 'agent', 'A2', 'committed', 'resubmission, obligation_ref OB-2026-0409', 'PO-2026-00318', '2f64', 'a0cb', '8d3e', '77c1'],
    [4096, '11:40', 'platform.obligation.resolve', 'Ravi Shankar', 'person', '', 'refused', 'GATE.DUAL_CONTROL_SAME_ACTOR', 'OB-2026-0418', '8d3e', '77c1', 'c150', '4b9e'],
    [4097, '11:42', 'erp.payment_entry.submit', 'Rekha Subramanian', 'person', 'A4', 'committed', 'undo until 24 Oct 2026 11:42', 'PE-2026-00972 · ACME Textiles · ₹1,12,500', 'c150', '4b9e', '64ab', 'd2f0'],
    [4098, '14:07', 'erp.sales_invoice.submit', 'ar-agent', 'agent', 'A3', 'refused', 'GATE.PRECONDITION_FAILED', 'ACME Textiles · ₹4,20,000', '64ab', 'd2f0', '1e9c', '83a5'],
    [4099, '14:16', 'erp.sales_invoice.submit', 'ar-agent', 'agent', 'A2', 'escalated', 'OB-2026-0412', 'ACME Textiles · ₹2,40,000', '1e9c', '83a5', 'b7f2', '0e61'],
    [4100, '15:02', 'platform.obligation.resolve', 'Venkat Raman', 'person', '', 'committed', 'approve · resolves OB-2026-0412', '—', 'b7f2', '0e61', '4c08', 'f93d'],
    [4101, '15:02', 'erp.sales_invoice.submit', 'ar-agent', 'agent', 'A2', 'committed', 'IRN requested; undo until 25 Sep 15:02', 'SINV-2026-01187 · ₹2,40,000', '4c08', 'f93d', '9a51', '2c7e'],
    [4102, '15:10', 'erp.payment_entry.submit', 'bank-recon-agent', 'agent', 'A3', 'platform', 'PLATFORM.TARGET_UNREACHABLE', 'UTR 426817 · ₹75,000', '9a51', '2c7e', 'd6e3', '1b48'],
    [4103, '15:12', 'erp.sales_invoice.cancel', 'Collections Agent', 'agent', 'A2', 'escalated', 'OB-2026-0413', 'INV-2026-0834 · ₹2,00,000', 'd6e3', '1b48', '7702', 'ae19'],
    [4104, '15:19', 'platform.obligation.resolve', 'Ravi Shankar', 'person', '', 'committed', 'approve by voice · VR-2026-09-24-0192', 'OB-2026-0413', '7702', 'ae19', '3fb0', '6c55'],
    [4105, '15:19', 'erp.sales_invoice.cancel', 'Collections Agent', 'agent', 'A2', 'committed', 'irreversible', 'INV-2026-0834', '3fb0', '6c55', 'e18d', '09b2'],
    [4106, '15:21', 'erp.supplier.create', 'vendor-onboarding agent', 'agent', 'A0', 'refused', 'POLICY.AUTONOMY_INSUFFICIENT', 'Palani Dyes & Chemicals', 'e18d', '09b2', '5a7c', 'd3e0'],
    [4107, '15:22', 'erp.credit_limit.change', 'Rekha Subramanian', 'person', 'A2', 'escalated', 'OB-2026-0414', 'ACME Textiles', '5a7c', 'd3e0', '0bd4', '71f8'],
    [4108, '15:24', 'erp.sales_invoice.submit', 'rung1 drafting agent', 'agent', 'A2', 'refused', 'GATE.BUDGET_EXHAUSTED', 'Lakshmi Garments', '0bd4', '71f8', 'c9e1', '4a02'],
    [4109, '15:25', 'platform.obligation.resolve', 'Venkat Raman', 'person', '', 'committed', 'reject · OB-2026-0410', 'price list update', 'c9e1', '4a02', '62f7', 'b8d9'],
    [4110, '15:26', 'erp.journal_entry.submit', 'close-agent', 'agent', 'A1', 'refused', 'POLICY.OBLIGATION_EXPIRED', 'JV provision', '62f7', 'b8d9', '18ac', 'e57d'],
    [4111, '15:27', 'erp.payment_run.submit', 'ap-agent', 'agent', 'A2', 'escalated', 'OB-2026-0411', '14 suppliers · ₹18,42,760', '18ac', 'e57d', 'f04b', '2d96'],
    [4112, '15:28', 'erp.stock_entry.submit', 'stock-agent', 'agent', 'A4', 'refused', 'GATE.SANDBOX_DIVERGED', 'STE-2026-02214', 'f04b', '2d96', 'a8e2', '07c3']
  ];
  var WT_CYCLE = ['erp.sales_invoice.submit', 'erp.payment_entry.submit', 'erp.stock_entry.submit', 'erp.purchase_invoice.submit', 'platform.obligation.resolve', 'erp.sales_invoice.submit', 'erp.payment_entry.submit', 'erp.purchase_order.submit', 'erp.stock_entry.submit', 'erp.customer.create'];
  var ACTORS = { 'erp.sales_invoice.submit': ['ar-agent', 'agent', 'A2'], 'erp.payment_entry.submit': ['bank-recon-agent', 'agent', 'A3'], 'erp.stock_entry.submit': ['stock-agent', 'agent', 'A4'], 'erp.purchase_invoice.submit': ['ap-agent', 'agent', 'A3'], 'platform.obligation.resolve': ['Venkat Raman', 'person', ''], 'erp.purchase_order.submit': ['ap-agent', 'agent', 'A2'], 'erp.customer.create': ['Priya Nair', 'person', 'A3'] };
  function record(seq) {
    seq = Number(seq);
    for (var i = 0; i < REC.length; i++) if (REC[i][0] === seq) {
      var r = REC[i];
      return { seq: r[0], at: '2026-09-24T' + r[1] + ':00+05:30', wt: r[2], actor: r[3], kind: r[4], A: r[5], outcome: r[6], code: /^[A-Z]+\./.test(r[7]) ? r[7] : '', note: /^[A-Z]+\./.test(r[7]) ? '' : r[7], object: r[8], prev: dig(r[9], r[10]), digest: dig(r[11], r[12]), canonical: true };
    }
    if (!(seq >= 1)) return null;
    var h = parseInt(hx('s' + seq, 4), 16), wt = WT_CYCLE[h % WT_CYCLE.length], a = ACTORS[wt];
    var out = h % 23 === 0 ? 'refused' : h % 11 === 0 ? 'escalated' : 'committed';
    var codes = ['GATE.PRECONDITION_FAILED', 'GATE.COUNTERPARTY_UNKNOWN', 'POLICY.AUTONOMY_INSUFFICIENT', 'GATE.BUDGET_EXHAUSTED'];
    var start = new Date('2026-09-01T09:15:00+05:30').getTime(), at = new Date(start + (seq - 1) * (23 * 86400000 / 4089));
    return { seq: seq, at: at.toISOString(), wt: wt, actor: a[0], kind: a[1], A: a[2], outcome: out, code: out === 'refused' ? codes[h % 4] : '', note: out === 'escalated' ? 'obligation raised' : '', object: '', prev: seq === 1 ? '0'.repeat(64) : hx('s' + (seq - 1) + 'd', 64), digest: hx('s' + seq + 'd', 64), canonical: false };
  }
  function recHref(seq) { return '#/auditor/records/' + seq; }
  function recLink(seq) { return '<a class="e1p-num" href="' + recHref(seq) + '">#' + n(seq) + '</a>'; }

  var AUD_TABS = function () {
    return [
      { id: 'home', label: 'Engagement', href: '#/auditor', icon: 'home' },
      { id: 'checklist', label: 'Checklist', href: '#/auditor/checklist', icon: 'list' },
      { id: 'recon', label: 'Reconciliation', href: '#/auditor/reconciliation', icon: 'scale' },
      { id: 'records', label: 'Records', href: '#/auditor/records', icon: 'proof' },
      { id: 'nightly', label: 'Nightly runs', href: '#/auditor/nightly', icon: 'chain' },
      { id: 'decl', label: 'Declarations', href: '#/auditor/declarations', icon: 'file-text' },
      { id: 'requests', label: 'Requests', href: '#/auditor/requests', icon: 'send' },
      { id: 'bundle', label: 'Bundle', href: '#/auditor/bundle/EB-2027-0007', icon: E1.atLeast('L2') ? 'package' : 'lock' },
      { id: 'pilot', label: 'ledger1 pilot', href: '#/auditor/pilot/PL-2027-01', icon: E1.atLeast('L2') ? 'flag' : 'lock' }
    ];
  };
  function audBand(active, states, o) {
    o = o || {};
    var expired = o.expired;
    return band({
      portal: 'Auditor portal', mark: AUD.mark, viewer: [AUD.person, AUD.role], eyebrow: 'Auditor portal · signed in', org: AUD.firm,
      sub: 'Signed in as ' + AUD.person + ' · ' + AUD.role + ' · read-only',
      facts: [
        { icon: 'building', html: 'Client <strong>' + esc(D.tenant.name) + '</strong>, ' + esc(D.tenant.place) },
        { icon: 'file-text', html: '<span class="e1-mono">' + AUD.eng.id + '</span> · ' + esc(AUD.eng.title) },
        { icon: 'timer', html: expired ? 'Access ended <strong>22 Oct 2026, 23:59 IST</strong>' : 'Access ' + esc(fmt.date(AUD.eng.from)) + ' – ' + esc(fmt.date(AUD.eng.to)) + ' · ' + c.countdown(AUD.eng.to, { label: 'Access ends', warn: 1440 }) },
        { icon: 'eye', html: 'Every view is recorded in the client\'s chain as a governed read' }
      ],
      tools: levelMenu('Client at') + statesMenu(states) + sandboxTag(),
      tabs: AUD_TABS(), active: active
    });
  }

  E1.route('/auditor', {
    title: 'Auditor portal', layout: 'bare', bareTitle: 'Auditor portal', keywords: 'auditor engagement evidence statutory CA read-only',
    render: function (p, q) {
      var states = [{ label: 'Live engagement', href: '#/auditor' }, { label: 'Access window ended', href: '#/auditor?state=expired' }, { label: 'Portal cannot load (our failure)', href: '#/auditor?state=error' }];
      if (q.state === 'expired') {
        return wrap(audBand('home', states, { expired: true }), c.pageHeader({ title: 'Your access to this engagement has ended', eyebrow: 'Auditor portal · ' + AUD.eng.id }) +
          c.empty({ icon: 'timer', title: 'Access to Kaveri Spinning Mills\' evidence ended on 22 Oct 2026 at 23:59 IST.', why: 'Access is time-boxed by the client, and it ends by default. Nothing you recorded is lost: your checklist, requests and reconciliation notes stay with your firm\'s copy.', fill: 'The client\'s owner can extend the window. That extension is itself a governed write in their chain, approved by a second person.', action: [{ label: 'Ask the client to extend', href: '#/auditor/requests/new?item=extension' }, { label: 'Public verifier', href: '#/verify', kind: 'ghost' }] }));
      }
      if (q.state === 'error') {
        return wrap(audBand('home', states), c.pageHeader({ title: 'Engagement evidence', eyebrow: 'Auditor portal · ' + AUD.eng.id }) +
          c.error({ title: 'We cannot show the client\'s evidence right now.', body: 'The evidence registry did not answer. This is our failure, not a rule, and not a finding about the client.', reassurance: 'Nothing about the records has changed. Your access window is unaffected, and this outage is itself recorded on the public status page.', code: 'PLATFORM.REGISTRY_UNAVAILABLE', action: [{ label: 'Try again', href: '#/auditor' }, { label: 'Status page', href: '#/status', kind: 'ghost' }] }));
      }
      var done = checklistDone();
      var stats = '<div class="e1p-grid e1p-grid--4">' +
        c.stat({ label: 'Records in scope', value: '4,112', note: 'seq #1–#4,112 · 1–24 Sep 2026', href: '#/auditor/records' }) +
        c.stat({ label: 'Refused, recorded in full', value: '171', note: 'Each at ₹0, with its code and gate', href: '#/auditor/records?outcome=refused' }) +
        c.stat({ label: 'Chain standing', value: 'Continuous', note: 'seq 1–4,089 · 23 records not yet checked', href: '#/auditor/nightly' }) +
        c.stat({ label: 'Reconciliation exceptions', value: '3', note: 'ERPNext changes with no elan1 record', href: '#/auditor/reconciliation' }) + '</div>';
      var asks = [
        ['Sequence range', 'seq #1–#4,112, starting at genesis, with today\'s head', 'Provided', '#/auditor/records', 'range'],
        ['Chain continuity report', 'continuous · seq 1–4,089 · 19 of 23 write types · checked nightly 02:10 IST', 'Provided', '#/auditor/nightly', 'continuity'],
        ['Declaration versions, verbatim', '7 versions across 5 declarations, each with its certifier', 'Provided', '#/auditor/declarations', 'declarations'],
        ['Nightly integrity output, every night', '23 nightly runs · 1 range not yet checked', 'Provided', '#/auditor/nightly', 'nightly'],
        ['Meter reconciliation', 'Reconciled nightly in both directions · 0 mismatches', 'Provided', '#/auditor/nightly', 'meter']
      ];
      var askList = '<ul class="e1p-rows">' + asks.map(function (a, i) {
        return '<li><span class="e1p-rows__icon e1-mono">' + (i + 1) + '</span><div class="e1p-rows__main"><p class="e1p-rows__t">' + esc(a[0]) + '</p><p class="e1p-rows__d">' + esc(a[1]) + '</p></div><div class="e1p-rows__r">' + c.badge('good', a[2], { subtle: true }) + c.button('Open', { size: 'sm', href: a[3] }) + c.button('Request again', { size: 'sm', kind: 'ghost', href: '#/auditor/requests/new?item=' + a[4] }) + '</div></li>';
      }).join('') + '</ul>';
      var notEst = '<ul class="e1p-fields">' + [
        ['That the transactions were genuine', 'A record shows a change went through stated rules, not that the sale happened.'],
        ['That the books are complete', 'Changes made directly in ERPNext, outside this write path, are in ERPNext\'s own audit trail and not here. Test 3 finds them.'],
        ['That the rules were adequate', 'The declaration says which rules ran; whether they were the right rules is your judgement.'],
        ['That a stranger can check it without trusting elan1', 'At Level 1 records are hash-chained, not signed. That arrives at Level 2.'],
        ['That any obligation is satisfied', 'That determination belongs to the reader.']
      ].map(function (x) { return '<li style="display:block"><strong style="color:var(--text-primary)">' + esc(x[0]) + '.</strong> <span class="e1p-rows__d">' + esc(x[1]) + '</span></li>'; }).join('') + '</ul>';
      var side = '<div class="e1-stack">' +
        c.card({ title: 'Engagement', body: c.kv([
          ['Engagement', AUD.eng.id, { mono: true }], ['Client', D.tenant.name], ['Scope', 'Kaveri chain, seq #1–#4,112 (Level 1)'], ['Window', fmt.date(AUD.eng.from) + ' – ' + fmt.date(AUD.eng.to)],
          ['Granted by', AUD.eng.grantedBy.join(' and ') + ' (two people)'], ['Grant record', recLink(AUD.eng.grantSeq), { html: true }], ['Your team', AUD.team.map(function (t) { return t.name; }).join(', ')]
        ], { compact: true }) }) +
        c.card({ title: 'Level 1 checking procedure', body: c.progress(done, 6, { label: 'Tests recorded', note: done + ' of 6 have a result' }) + '<div style="margin-top:12px">' + c.button(done ? 'Continue the checklist' : 'Start the checklist', { kind: 'primary', href: '#/auditor/checklist', full: true }) + '</div>' }) +
        c.card({ title: 'Your access log', eyebrow: 'Visible to the client', body: c.timeline([
          { time: '24 Sep 2026, 15:40 IST', title: 'Viewed record #4,101', state: 'neutral', href: recHref(4101) },
          { time: '24 Sep 2026, 15:31 IST', title: 'Ran two-way reconciliation, 1–23 Sep', state: 'neutral', href: '#/auditor/reconciliation' },
          { time: '23 Sep 2026, 11:02 IST', title: 'Requested an explanation for ACC-JV-2026-00412', state: 'warning', href: '#/auditor/requests' }
        ]) }) + '</div>';
      var l2 = E1.atLeast('L2') ? '<div class="e1p-grid e1p-grid--2 e1p-mt">' + c.card({ title: 'Evidence bundle EB-2027-0007', eyebrow: 'Level 2 Attested', body: '<p class="e1p-note" style="margin:0 0 12px">12,480 records · 611 refusals · profile in-mca-audit-trail v1. Verify it on your own machine.</p>' + c.button('Open the bundle', { href: '#/auditor/bundle/EB-2027-0007', icon: 'package' }) }) +
        c.card({ title: 'ledger1 pilot PL-2027-01', eyebrow: 'Level 2 Attested', body: '<p class="e1p-note" style="margin:0 0 12px">Day 76 of 90. Your written verdict is due on Day 80.</p>' + c.button('Open the pilot', { href: '#/auditor/pilot/PL-2027-01', icon: 'flag' }) }) + '</div>'
        : '<div class="e1p-mt">' + portalLock('L2', { who: 'Your client', title: 'A bundle you can verify yourself arrives at Level 2 Attested', why: 'Today the client\'s records are hash-chained, not signed. You can test them against ERPNext and against the nightly integrity runs — but you cannot yet check them without trusting elan1\'s infrastructure.', items: ['A signed, anchored evidence bundle you verify offline', 'The ledger1 pilot: Day 0 statement to Day 80 written verdict', 'Key custody evidence you reconcile yourself'], today: 'The six Level 1 tests below, and the two-way reconciliation, are the checks that do the real work at Level 1.' }) + '</div>';
      return wrap(audBand('home', states),
        c.pageHeader({ title: 'Kaveri Spinning Mills — interim evidence', eyebrow: 'Auditor portal · ' + AUD.eng.id, lead: 'You have been asked to form a view on a system that lets software make changes to a company\'s books. Everything here is read-only, and every figure opens the records behind it.',
          actions: c.button('Request evidence', { kind: 'primary', icon: 'send', href: '#/auditor/requests/new' }) + c.button('Run test 3', { icon: 'scale', href: '#/auditor/reconciliation' }) }) +
        c.callout({ kind: 'caveat', title: 'It is written by the vendor. Read it as such.', body: '<p>The procedure, the wording and the portal are elan1\'s. Where this page and your own professional judgement disagree, yours wins — and please tell us where the language is wrong.</p>' }) + '<div class="e1p-gap"></div>' +
        stats + '<div class="e1p-gap"></div>' +
        '<div class="e1p-main-side"><div>' +
        c.section({ id: 'asks', title: 'The five things to ask for', lead: 'E11\'s list. Each is already in the portal; any can be requested again in a form you prefer.', body: askList }) +
        c.section({ id: 'limits', title: 'What an elan1 record does not establish', lead: 'Shown first, never collapsed.', body: '<div class="e1p-panel">' + notEst + '</div>' + '<p class="e1p-note" style="margin-top:10px">At Level 1, reconciliation against the target system — not chain verification — does the real work: a chain cut at record 4,000 of 4,200 is internally consistent and reads as complete.</p>' }) +
        '</div>' + side + '</div>' + l2);
    }
  });

  /* ---- Level 1 checking procedure (six tests) ----------------------------- */
  var TESTS = [
    { n: 1, t: 'Contiguity', what: 'Pick three ranges, one of them today\'s. Confirm seq starts where the client says and never skips; each prev_digest names the record before.', rec: 'The ranges you checked, the first and last seq, any gap found.', ev: [['Records #4,090–#4,112', '#/auditor/records?from=4090&to=4112'], ['Nightly runs', '#/auditor/nightly']] },
    { n: 2, t: 'Scope', what: 'Establish which write types the chain covers — 19 of 23 — and which it does not, and why.', rec: 'The uncovered write types and the reason the client gives for each.', ev: [['Declarations', '#/auditor/declarations']] },
    { n: 3, t: 'Two-way reconciliation to the target system', what: 'Match the chain against ERPNext\'s own audit trail for the period, in both directions.', rec: 'Changes in ERPNext with no elan1 record — the finding that matters — and elan1 records with no ERPNext change.', ev: [['Open the reconciliation workspace', '#/auditor/reconciliation']], hero: true },
    { n: 4, t: 'Refusals', what: 'Sample refused records. Each has a code, the gate that raised it, a zeroed record identifier and a meter quantity of 0.', rec: 'Sample size, codes seen, any refusal without a code.', ev: [['Refused records', '#/auditor/records?outcome=refused'], ['#4,098 credit limit', recHref(4098)]] },
    { n: 5, t: 'Segregation', what: 'For every approval, the approver is a person and is not the proposer. Same-actor attempts are refused and recorded.', rec: 'Approvals sampled; any approval by an agent; any same-actor approval.', ev: [['#4,096 same-actor refusal', recHref(4096)], ['Approvals by people', '#/auditor/records?actor=person']] },
    { n: 6, t: 'Enforcement mode', what: 'For each write type, the mode — Enforced or Attested advisory — matches what the client told you in writing.', rec: 'Mode per write type, and the document it was compared with.', ev: [['Declarations', '#/auditor/declarations']] }
  ];
  function checkState(nn) { return E1.store.get('p.check.' + nn, { r: 'notchecked', note: '' }); }
  function checklistDone() { var k = 0; TESTS.forEach(function (t) { if (checkState(t.n).r !== 'notchecked') k++; }); return k; }
  E1.route('/auditor/checklist', {
    title: 'Level 1 checking procedure', layout: 'bare', bareTitle: 'Auditor portal', keywords: 'auditor acceptance test checklist six tests contiguity scope reconciliation refusals segregation enforcement',
    render: function () {
      var done = checklistDone();
      var asks = '<div class="e1-row" style="gap:8px;flex-wrap:wrap">' + [['Sequence range', 'range'], ['Continuity report', 'continuity'], ['Declaration versions', 'declarations'], ['Nightly outputs', 'nightly'], ['Meter reconciliation', 'meter']].map(function (a) { return c.button(a[0], { size: 'sm', icon: 'send', href: '#/auditor/requests/new?item=' + a[1] }); }).join('') + '</div>';
      var tests = TESTS.map(function (t) {
        var s = checkState(t.n);
        var seg = '<div class="e1-seg e1-seg--sm" role="radiogroup" aria-label="Result for test ' + t.n + '">' + [['passed', 'Passed'], ['failed', 'Failed'], ['notchecked', 'Not checked']].map(function (o) {
          var on = s.r === o[0];
          return '<button type="button" class="e1-seg__item" role="radio" aria-checked="' + on + '" data-action="p-check" data-value="' + t.n + ':' + o[0] + '">' + esc(o[1]) + '</button>';
        }).join('') + '</div>';
        var badge = s.r === 'passed' ? c.badge('good', 'Passed') : s.r === 'failed' ? c.badge('critical', 'Failed — finding') : c.badge('neutral', 'Not checked');
        return '<article class="e1p-test' + (t.hero ? ' e1p-test--hero' : '') + '" id="test-' + t.n + '"><div><h3><span class="e1-mono e1-muted">Test ' + t.n + '</span> ' + esc(t.t) + (t.hero ? ' ' + c.badge('info', 'Does the real work at Level 1', { subtle: true }) : '') + '</h3>' +
          '<dl><dt>What to do</dt><dd>' + esc(t.what) + '</dd><dt>What to record</dt><dd>' + esc(t.rec) + '</dd><dt>Evidence</dt><dd>' + t.ev.map(function (e) { return '<a href="' + e[1] + '">' + esc(e[0]) + '</a>'; }).join(' · ') + '</dd>' +
          (s.note ? '<dt>Your note</dt><dd>' + esc(s.note) + '</dd>' : '') + '</dl></div>' +
          '<div class="e1p-test__res">' + badge + seg + c.button(s.note ? 'Edit note' : 'Add a note', { size: 'sm', kind: 'ghost', icon: 'edit', attrs: 'data-action="p-check-note" data-value="' + t.n + '"' }) + '</div></article>';
      }).join('');
      return wrap(audBand('checklist', [{ label: 'Clear my results', href: '#/auditor/checklist?reset=1' }]),
        c.pageHeader({ title: 'Level 1 checking procedure', eyebrow: 'Auditor portal · auditor acceptance test', lead: 'Six tests you can run today against the client\'s Level 1 records. Each result is yours: passed, failed, or not checked — never assumed.',
          actions: c.button('Export worksheet', { icon: 'download', attrs: 'data-action="p-export" data-value="Worksheet ENG-2026-014 (6 tests)"' }),
          meta: c.progress(done, 6, { label: 'Recorded', note: done + ' of 6 tests have a result' }) }) +
        c.section({ id: 'asks', title: 'First, the five asks', lead: 'Request any of them in the form you prefer. Each request is recorded in the client\'s chain.', body: asks }) +
        c.section({ id: 'tests', title: 'The six tests', body: '<div class="e1-stack">' + tests + '</div>' }) +
        c.callout({ kind: 'info', title: 'What we ask of you in return.', body: '<p>Tell us where the language is wrong. We will not ask for an endorsement, for a logo, or for a quotation.</p>' }));
    },
    mount: function (el, p, q) { if (q.reset === '1') { TESTS.forEach(function (t) { E1.store.set('p.check.' + t.n, { r: 'notchecked', note: '' }); }); E1.go('/auditor/checklist', null, { replace: true }); } }
  });
  E1.action('p-check', function (el) {
    var v = el.getAttribute('data-value').split(':'), nn = v[0], r = v[1], s = checkState(nn);
    if (r === 'failed' && (!s.note || s.note.length < 12)) { openCheckNote(nn, 'failed'); return; }
    s.r = r; E1.store.set('p.check.' + nn, s); E1.render({ keepScroll: true });
    E1.announce('Test ' + nn + ' recorded as ' + (r === 'notchecked' ? 'not checked' : r));
  });
  E1.action('p-check-note', function (el) { openCheckNote(el.getAttribute('data-value')); });
  function openCheckNote(nn, forceResult) {
    var s = checkState(nn), t = TESTS[Number(nn) - 1];
    E1.modal({
      title: 'Test ' + nn + ' · ' + t.t, eyebrow: forceResult === 'failed' ? 'A failed test needs a finding' : 'Your working note',
      body: '<div class="e1-stack">' + (forceResult === 'failed' ? '<p class="e1p-note">Write the finding in a sentence: what you saw, where, and the seq or document it concerns.</p>' : '') +
        c.field('Note', c.textarea({ id: 'p-note', rows: 4, value: s.note, describedBy: 'p-note-msg' }), { id: 'p-note', required: forceResult === 'failed', help: 'At least 12 characters. Kept with your firm\'s copy of the worksheet.' }) + '</div>',
      actions: [{ label: 'Cancel', kind: 'ghost' }, { label: forceResult === 'failed' ? 'Record as failed' : 'Save note', kind: 'primary', onClick: function (e, close, root) {
        var v = String(sel('#p-note', root).value || '').trim();
        if (v.length < 12) { showFieldError(sel('#p-note', root), 'Write at least 12 characters, so the note means something to the next reader.'); return false; }
        s.note = v; if (forceResult) s.r = forceResult; E1.store.set('p.check.' + nn, s); close(); E1.render({ keepScroll: true }); E1.toast('Test ' + nn + ' ' + (forceResult ? 'recorded as failed, with your finding.' : 'note saved.'), 'good');
      } }]
    });
  }
  E1.action('p-export', function (el) { E1.toast('Prototype: nothing is downloaded. The export would carry the engagement id and the time it was made.', 'info', { title: el.getAttribute('data-value') || 'Export' }); });

  /* ---- Two-way reconciliation (E11 test 3) -------------------------------- */
  var DIR_A = [
    { doc: 'ACC-JV-2026-00412', type: 'Journal Entry', by: 'rajesh.k@kaveri.rung1.in', via: 'ERPNext Desk (UI)', at: '2026-09-12T16:40:00+05:30', change: 'accounts[1].debit ₹84,000 → ₹48,000', wt: 'erp.journal_entry.submit', note: 'A governed write type, changed outside the gates.' },
    { doc: 'Shree Murugan Traders', type: 'Customer', by: 'Administrator', via: 'ERPNext Desk (UI)', at: '2026-09-17T11:05:00+05:30', change: 'credit_limit ₹2,00,000 → ₹3,50,000', wt: 'erp.credit_limit.change', note: 'Credit-limit changes are dual control in elan1; this one had no approver.' },
    { doc: 'STE-2026-02188', type: 'Stock Entry', by: 'stores@kaveri.rung1.in', via: 'Data Import', at: '2026-09-20T18:22:00+05:30', change: 'items[0].qty 1,150 kg → 1,200 kg', wt: 'erp.stock_entry.submit', note: 'Bulk import path; not declared as a channel.' }
  ];
  E1.route('/auditor/reconciliation', {
    title: 'Two-way reconciliation', layout: 'bare', bareTitle: 'Auditor portal', keywords: 'reconciliation test 3 erpnext audit trail exceptions two-way',
    render: function (p, q) {
      var st = q.state || (E1.store.get('p.recon.ran', true) ? 'done' : 'empty');
      var states = [{ label: 'Results (default)', href: '#/auditor/reconciliation' }, { label: 'Before upload', href: '#/auditor/reconciliation?state=empty' }, { label: 'Running', href: '#/auditor/reconciliation?state=running' }, { label: 'File unreadable', href: '#/auditor/reconciliation?state=error' }];
      var inputs = c.card({ title: 'Inputs', eyebrow: 'E11 test 3', body: '<div class="e1p-grid e1p-grid--3">' +
        c.field('Period', c.select({ id: 'p-period', options: [{ value: 'sep', label: '1–23 Sep 2026 (nightly-checked)' }, { value: 'aug', label: 'August 2026 (no chain yet)' }], value: 'sep' }), { id: 'p-period', help: 'Only ranges covered by a completed nightly run.' }) +
        c.field('ERPNext audit trail', '<label class="e1p-drop" style="padding:10px 12px" data-p-drop2><span class="e1p-rows__main"><span class="e1p-rows__t e1-mono" style="font-size:var(--text-caption)">' + (st === 'empty' ? 'No file chosen' : 'kaveri-erpnext-version-log-2026-09-01_23.csv') + '</span><span class="e1p-rows__d" style="display:block;font-size:var(--text-caption)">' + (st === 'empty' ? 'Version log export, CSV' : '4,318 rows · 1.2 MB · read locally') + '</span></span><input type="file" id="p-trail" accept=".csv" aria-label="Choose the ERPNext version log"><span class="e1-btn e1-btn--secondary e1-btn--sm" aria-hidden="true"><span>Choose</span></span></label>', { help: 'Export it yourself from ERPNext, not from elan1.' }) +
        c.field('elan1 chain range', c.input({ id: 'p-range', value: '#1–#4,089', mono: true, readonly: true }), { id: 'p-range', help: 'Continuous · checked 24 Sep 02:10 IST.' }) + '</div>' +
        '<div class="e1-row" style="gap:8px;margin-top:14px">' + c.button(st === 'done' ? 'Run again' : 'Run reconciliation', { kind: 'primary', icon: 'play', attrs: 'data-action="p-recon-run"', disabled: st === 'running' }) + '<span class="e1p-note">Runs over your file and the chain range. Nothing is changed in ERPNext or in the chain.</span></div>' });
      var body;
      if (st === 'empty') body = c.empty({ icon: 'scale', title: 'No reconciliation has been run for this period yet.', why: 'Test 3 needs ERPNext\'s own audit trail — exported by you — to compare against the chain.', fill: 'Choose the version-log file above, then run. It takes about a minute for a month.', action: { label: 'Test 3 in the checklist', href: '#/auditor/checklist' } });
      else if (st === 'running') body = c.card({ title: 'Reconciling 1–23 Sep 2026', body: c.progress(62, 100, { label: 'Matching ERPNext versions to chain records', note: '2,081 of 3,355 ERPNext changes matched so far', state: 'accent' }) + '<div style="margin-top:14px">' + c.skeleton({ kind: 'table', rows: 4 }) + '</div>' });
      else if (st === 'error') body = c.error({ title: 'The file could not be read as an ERPNext version log.', body: 'It has 4,318 rows but no “docname” or “ref_doctype” column, so no row can be matched to a record.', reassurance: 'Nothing was compared and nothing was recorded as a finding.', action: [{ label: 'Choose another file', href: '#/auditor/reconciliation?state=empty' }] });
      else {
        var kpis = '<div class="e1p-grid e1p-grid--4">' +
          c.stat({ label: 'ERPNext changes, governed doctypes', value: '3,355', note: 'From your version-log file' }) +
          c.stat({ label: 'Matched both ways', value: '3,352', note: 'Each to one committed record', href: '#/auditor/records?outcome=committed' }) +
          c.stat({ label: 'ERPNext change, no elan1 record', value: '3', note: 'The finding that matters — listed below' }) +
          c.stat({ label: 'elan1 record, no ERPNext change', value: '1', note: 'Explained: reversed in window' }) + '</div>';
        var tA = c.table({ caption: 'Changes in ERPNext with no elan1 record', columns: [
          { key: 'doc', label: 'ERPNext document', render: function (r) { return '<span class="e1-mono">' + esc(r.doc) + '</span><div class="e1p-note">' + esc(r.type) + '</div>'; } },
          { key: 'change', label: 'Change', mono: true },
          { key: 'by', label: 'Changed by, via', render: function (r) { return esc(r.by) + '<div class="e1p-note">' + esc(r.via) + '</div>'; } },
          { key: 'at', label: 'When', nowrap: true, render: function (r) { return esc(fmt.dateTime(r.at)); } },
          { key: 'wt', label: 'Would have been', render: function (r) { return '<span class="e1-mono">' + esc(r.wt) + '</span><div class="e1p-note">' + esc(r.note) + '</div>'; } },
          { key: 'act', label: '', html: true, render: function (r) { return c.button('Ask the client', { size: 'sm', href: '#/auditor/requests/new?item=explanation&ref=' + encodeURIComponent(r.doc) }); } }
        ], rows: DIR_A });
        var tB = c.table({ caption: 'elan1 records with no ERPNext change', columns: [
          { key: 'seq', label: 'Record', html: true }, { key: 'wt', label: 'Write type', mono: true }, { key: 'what', label: 'What happened' }, { key: 'st', label: 'Status', html: true }
        ], rows: [{ seq: recLink(3977), wt: 'erp.stock_entry.submit', what: 'Committed 19 Sep 14:02, reversed at #3,981 within its window (target_native_undo). ERPNext shows the entry and its cancellation — net no change.', st: c.badge('info', 'Explained — reversal in window') }] });
        body = kpis + '<div class="e1p-gap"></div>' +
          c.section({ id: 'dir-a', title: 'Changes in ERPNext with no elan1 record', lead: 'The finding that matters: these are changes that did not go through the gates.', actions: c.button('Export exceptions', { size: 'sm', icon: 'download', attrs: 'data-action="p-export" data-value="Reconciliation exceptions, 1–23 Sep 2026 (4 rows)"' }), body: tA }) +
          c.section({ id: 'dir-b', title: 'elan1 committed records with no ERPNext change', lead: 'Usually a reversal inside its window, or a write ERPNext has not applied yet.', body: tB }) +
          c.callout({ kind: 'rule', title: 'Why this test, and not the chain alone.', body: '<p>A chain cut at record 4,000 of 4,200 is internally consistent and reads as complete. Only the target system\'s own trail shows changes that never reached the write path.</p>' });
      }
      return wrap(audBand('recon', states), c.pageHeader({ title: 'Two-way reconciliation', eyebrow: 'Auditor portal · test 3', lead: 'The chain against ERPNext\'s own audit trail, in both directions. This is the test that does the real work at Level 1.' }) + inputs + '<div class="e1p-gap"></div>' + body);
    },
    mount: function (el) {
      var f = sel('#p-trail', el);
      if (f) f.addEventListener('change', function () { if (f.files && f.files[0]) { E1.toast('Read locally: ' + f.files[0].name + '. Nothing was uploaded.', 'info'); E1.go('/auditor/reconciliation', { state: 'running' }); setTimeout(function () { if (E1.state.route.path === '/auditor/reconciliation') { E1.store.set('p.recon.ran', true); E1.go('/auditor/reconciliation', null, { replace: true }); } }, 1400); } });
    }
  });
  E1.action('p-recon-run', function () {
    E1.go('/auditor/reconciliation', { state: 'running' });
    setTimeout(function () { if (E1.state.route.path === '/auditor/reconciliation') { E1.store.set('p.recon.ran', true); E1.go('/auditor/reconciliation', null, { replace: true }); E1.toast('3,352 matched both ways. 3 ERPNext changes have no elan1 record.', 'warning', { title: 'Reconciliation finished' }); } }, 1400);
  });

  /* ---- Records in scope -------------------------------------------------- */
  E1.route('/auditor/records', {
    title: 'Records in scope', layout: 'bare', bareTitle: 'Auditor portal', keywords: 'records chain proof entries auditor',
    render: function (p, q) {
      var from = Math.max(1, Number(q.from) || 1), to = Math.min(q.to ? Number(q.to) : AUD.head, 60000), page = Math.max(1, Number(q.page) || 1), per = 25;
      var big = to > AUD.head;
      var all = [], s;
      var hi = Math.min(to, big ? to : AUD.head);
      for (s = hi; s >= from && all.length < 400; s--) all.push(record(s));
      all = all.filter(function (r) { return (!q.outcome || r.outcome === q.outcome || (q.outcome === 'refused' && r.outcome === 'platform')) && (!q.actor || r.kind === q.actor); });
      var pages = Math.max(1, Math.ceil(all.length / per)), rows = all.slice((page - 1) * per, page * per);
      var base = { from: q.from, to: q.to, outcome: q.outcome, actor: q.actor };
      function h(ext) { return E1.href('/auditor/records', Object.assign({}, base, ext, { page: undefined })); }
      var filters = c.filters([
        { label: 'All outcomes', href: h({ outcome: undefined }), active: !q.outcome },
        { label: 'Committed', href: h({ outcome: 'committed' }), active: q.outcome === 'committed' },
        { label: 'Not done (refused)', href: h({ outcome: 'refused' }), active: q.outcome === 'refused' },
        { label: 'Waiting on a person', href: h({ outcome: 'escalated' }), active: q.outcome === 'escalated' }
      ], { label: 'Outcome' }) + c.filters([
        { label: 'Agents and people', href: h({ actor: undefined }), active: !q.actor },
        { label: 'Agents only', href: h({ actor: 'agent' }), active: q.actor === 'agent' },
        { label: 'People only', href: h({ actor: 'person' }), active: q.actor === 'person' }
      ], { label: 'Actor kind', clearHref: '#/auditor/records' });
      var tbl = c.table({
        caption: 'Records in scope', dense: true, rowHref: function (r) { return recHref(r.seq); },
        columns: [
          { key: 'seq', label: 'Seq', mono: true, render: function (r) { return '#' + n(r.seq); } },
          { key: 'at', label: 'Recorded (IST)', nowrap: true, render: function (r) { return esc(fmt.dateTime(r.at)); } },
          { key: 'wt', label: 'Write type', mono: true },
          { key: 'actor', label: 'Actor', render: function (r) { return c.actor({ name: r.actor, kind: r.kind, size: 'sm', role: r.A ? r.A : '' }); } },
          { key: 'outcome', label: 'Outcome', render: function (r) { return c.outcome(r.outcome, { code: r.code, subtle: true }); } },
          { key: 'digest', label: 'Digest', render: function (r) { return c.hash(r.digest, { copy: false, head: 6, tail: 4 }); } }
        ],
        rows: rows,
        empty: { title: 'No records match these filters in this range.', why: 'The range #' + n(from) + '–#' + n(hi) + ' has no ' + (q.outcome || '') + ' records ' + (q.actor ? 'by ' + q.actor + 's' : '') + '.', action: { label: 'Clear filters', href: '#/auditor/records' } }
      });
      return wrap(audBand('records', [{ label: 'All in scope', href: '#/auditor/records' }, { label: 'Refused only', href: '#/auditor/records?outcome=refused' }, { label: 'Filters with no match', href: '#/auditor/records?from=4090&to=4091&outcome=escalated' }]),
        c.pageHeader({ title: 'Records in scope', eyebrow: 'Auditor portal · Kaveri chain', lead: 'Each governed write, refusal and approval is one record. Level 1: hash-chained, not signed.',
          actions: c.button('Request this range', { icon: 'send', href: '#/auditor/requests/new?item=range&from=' + from + '&to=' + hi }),
          meta: '<span class="e1p-fact">' + c.icon('hash', 14) + '<span>Range <span class="e1-mono">#' + n(from) + '–#' + n(hi) + '</span> · ' + n(all.length) + (all.length >= 400 ? '+' : '') + ' shown by these filters</span></span><span class="e1p-fact">' + c.level('L1') + '<span>' + (hi > 41206 ? 'Illustrative range beyond today\'s head' : 'Each record labelled by its own level') + '</span></span>' }) +
        c.toolbar(filters) + tbl + (pages > 1 ? c.pagination({ page: page, pages: pages, total: all.length, href: function (pg) { return E1.href('/auditor/records', Object.assign({}, base, { page: pg })); } }) : ''));
    }
  });

  E1.route('/auditor/records/:seq', {
    title: function (p) { return 'Record #' + n(Number(p.seq) || 0); }, layout: 'bare', bareTitle: 'Auditor portal', example: '/auditor/records/4101',
    render: function (p) {
      var r = record(p.seq);
      if (!r || r.seq > 60000) {
        return wrap(audBand('records'), c.pageHeader({ title: 'Record not in your scope', eyebrow: 'Auditor portal', back: ['Records in scope', '#/auditor/records'] }) +
          c.empty({ icon: 'proof', title: 'There is no record “' + p.seq + '” in the range you were given.', why: 'Your engagement covers seq #1–#' + n(AUD.head) + '. Sequence numbers start at 1 and never skip, so any other number is outside your scope or not yet written.', action: { label: 'Records in scope', href: '#/auditor/records' } }));
      }
      var L = r.seq <= 41206 ? 'L1' : 'L2';
      var lvl = E1.atLeast(L) ? L : 'L1';
      var sealHtml = c.seal({ seq: r.seq, writeType: r.wt, outcome: r.outcome, code: r.code, actor: { name: r.actor, kind: r.kind }, at: fmt.dateTime(r.at), digest: r.digest, prev: r.prev, declaration: r.wt.indexOf('platform.') === 0 ? 'platform v3' : 'erp.ar v7', policy: 'policy v11', level: L === 'L2' && E1.atLeast('L2') ? 'L2' : 'L1', keyId: 'k_in_20270701_4d7e' });
      var refused = r.outcome === 'refused' || r.outcome === 'platform';
      var fields = [
        ['F01', 'tenant_id', D.tenant.tenantId], ['F02', 'seq', String(r.seq)], ['F03', 'prev_digest', r.seq === 1 ? '0000…0000 (genesis)' : r.prev], ['F04', 'write_id', 'wr_' + hx('w' + r.seq, 10)],
        ['F05', 'write_type', r.wt], ['F06', 'declaration_id', hx('decl-ar', 8) + '-…'], ['F07', 'declaration_version', r.wt.indexOf('platform.') === 0 ? '3' : '7'], ['F08', 'policy_version', '11'],
        ['F09', 'actor_id', hx('a' + r.actor, 8) + '-…'], ['F10', 'actor_kind', r.kind === 'person' ? 'human' : r.kind], ['F11', 'autonomy_level', r.A || '—'], ['F12', 'record_id', refused || r.outcome === 'escalated' ? '00000000-0000-0000-0000-000000000000' : hx('r' + r.seq, 8) + '-…'],
        ['F13', 'record_version', refused || r.outcome === 'escalated' ? '0' : '1'], ['F14', 'payload_hash', hx('p' + r.seq, 64)], ['F15', 'lexicon_hash', hx('lex', 64)], ['F16', 'recorded_at', new Date(r.at).toISOString().replace('.000', '')]
      ];
      var ftbl = c.table({ caption: 'The sixteen fields', dense: true, columns: [{ key: 'f', label: '#', mono: true, width: '48px' }, { key: 'k', label: 'Field', mono: true }, { key: 'v', label: 'Value', html: true }], rows: fields.map(function (x) { return { f: x[0], k: x[1], v: /^[0-9a-f]{64}$/.test(x[2]) ? c.hash(x[2], { label: x[1] }) : '<span class="e1-mono">' + esc(x[2]) + '</span>' }; }) });
      return wrap(audBand('records'),
        c.pageHeader({ title: 'Record #' + n(r.seq), eyebrow: 'Auditor portal · Kaveri chain', back: ['Records in scope', '#/auditor/records'], lead: r.object ? r.wt + ' · ' + r.object : r.wt,
          actions: c.button('Previous', { size: 'sm', icon: 'arrow-left', href: recHref(Math.max(1, r.seq - 1)), disabled: r.seq <= 1 }) + c.button('Next', { size: 'sm', iconRight: 'arrow-right', href: recHref(r.seq + 1), disabled: r.seq >= AUD.head && L === 'L1' }) }) +
        '<div class="e1p-main-side"><div class="e1-stack">' + sealHtml +
        c.section({ id: 'fields', title: 'The sixteen fields', lead: 'Frozen forever: length-prefixed, SHA-256. Gate results, approver identity and the payload sit beside the record, never inside it.', body: ftbl }) +
        '</div><div class="e1-stack">' +
        c.card({ title: 'Beside the record', body: c.kv([['Outcome', c.outcome(r.outcome, { code: r.code }), { html: true }], ['Note', r.note || '—'], ['Object', r.object || '—'], ['Meter', refused || r.outcome === 'escalated' ? 'quantity 0 · ₹0' : '1 · basis from blast radius']], { compact: true }) }) +
        c.card({ title: 'Tie to the neighbours', body: '<p class="e1p-note" style="margin:0 0 8px">prev_digest of this record equals the digest of #' + n(r.seq - 1) + '.</p>' + c.button('Open #' + n(Math.max(1, r.seq - 1)), { size: 'sm', href: recHref(Math.max(1, r.seq - 1)) }) }) +
        c.card({ title: 'Ask about this record', body: c.button('Request an explanation', { size: 'sm', icon: 'send', href: '#/auditor/requests/new?item=explanation&ref=%23' + r.seq, full: true }) }) + '</div></div>');
    }
  });

  /* ---- Nightly integrity runs + meter reconciliation ---------------------- */
  E1.route('/auditor/nightly', {
    title: 'Nightly integrity runs', layout: 'bare', bareTitle: 'Auditor portal', keywords: 'nightly integrity continuity report meter reconciliation',
    render: function () {
      var runs = [], i, head = 0;
      var perDay = [0, 181, 176, 169, 170, 88, 64, 188, 183, 179, 181, 186, 91, 70, 190, 184, 187, 176, 182, 94, 66, 188, 185, 180];
      for (i = 1; i <= 23; i++) { head += perDay[i]; runs.push({ night: '2026-09-' + (i + 1 < 10 ? '0' : '') + (i + 1) + 'T02:10:00+05:30', covered: '#1–#' + n(i === 23 ? 4089 : head), records: i === 23 ? 4089 : head, st: 'continuous', dur: '00:00:' + (10 + (i % 7)) }); }
      runs.reverse();
      var tbl = c.table({ caption: 'Nightly integrity runs', dense: true, columns: [
        { key: 'night', label: 'Run (IST)', nowrap: true, render: function (r) { return esc(fmt.dateTime(r.night)); } },
        { key: 'st', label: 'Standing', render: function () { return c.badge('good', 'continuous'); } },
        { key: 'covered', label: 'Scope', mono: true },
        { key: 'records', label: 'Records', align: 'right', render: function (r) { return '<span class="e1-mono">' + n(r.records) + '</span>'; } },
        { key: 'wt', label: 'Write types', render: function () { return '19 of 23'; } },
        { key: 'dur', label: 'Duration', mono: true }
      ], rows: runs });
      var meter = c.table({ caption: 'Meter reconciliation', dense: true, columns: [
        { key: 'wt', label: 'Write type', mono: true }, { key: 'basis', label: 'Basis' }, { key: 'c', label: 'Committed', align: 'right', mono: true }, { key: 'r', label: 'Refused (qty 0)', align: 'right', mono: true }, { key: 'e', label: 'Escalated (qty 0)', align: 'right', mono: true }
      ], rows: [
        { wt: 'erp.sales_invoice.submit', basis: 'per counterparty', c: '1,184', r: '97', e: '212' }, { wt: 'erp.payment_entry.submit', basis: 'per counterparty', c: '906', r: '14', e: '0' },
        { wt: 'erp.purchase_invoice.submit', basis: 'per counterparty', c: '441', r: '22', e: '61' }, { wt: 'erp.purchase_order.submit', basis: 'per counterparty', c: '118', r: '6', e: '34' },
        { wt: 'erp.stock_entry.submit', basis: 'per record', c: '732', r: '9', e: '3' }, { wt: 'erp.supplier.create / customer.create', basis: 'per record', c: '27', r: '11', e: '0' },
        { wt: 'erp.price_list.update', basis: 'per batch', c: '4', r: '0', e: '4' }, { wt: 'erp.payment_run.submit', basis: 'per batch', c: '3', r: '0', e: '3' },
        { wt: 'platform.obligation.resolve', basis: 'per record', c: '318', r: '12', e: '—' }, { wt: 'Total', basis: '', c: '3,733 billable', r: '171 · ₹0', e: '317 · ₹0' }
      ] });
      return wrap(audBand('nightly'),
        c.pageHeader({ title: 'Nightly integrity runs', eyebrow: 'Auditor portal · continuity report', lead: 'Every night the whole chain is recomputed from genesis. The result is three-valued — continuous, break at record N, or not checked over this range — and always carries its scope and count.' }) +
        c.chain([record(4089), record(4090), record(4091)].reverse().map(function (r) { return { seq: r.seq, digest: r.digest, prev: r.prev, writeType: r.wt, outcome: r.outcome === 'platform' ? 'refused' : r.outcome, at: fmt.time(r.at), actorKind: r.kind, href: recHref(r.seq) }; }), { standing: 'continuous', scope: '#1–#4,089 · 19 of 23 write types', count: '4,089 records', checkedAt: '24 Sep 2026, 02:10 IST' }) +
        '<div class="e1p-gap"></div>' + c.callout({ kind: 'info', title: 'Not checked over this range: #4,090–#4,112.', body: '<p>23 records written after last night\'s run. They will be checked tonight at 02:10 IST; until then they are not shown as clean. <a href="#/auditor/records?from=4090&to=4112">Open the 23 records</a>.</p>' }) +
        c.section({ id: 'runs', title: 'Every night, 1–23 Sep 2026', body: tbl }) +
        c.section({ id: 'meter', title: 'Meter reconciliation, 1–24 Sep 2026', lead: 'Reconciled nightly in both directions · 23 Sep 02:30 IST · 0 mismatches. Refusals and escalations meter at quantity 0, on the same table.', body: meter }));
    }
  });

  /* ---- Declarations, verbatim --------------------------------------------- */
  var DECLS = [
    ['erp.ar', 'rung1 — Accounts receivable (ERPNext)', 'Accounts head', 'v7 (in force)', 'Arjun Mehta', '2026-09-19', '7e41', 'd80f', 'ar-agent act.write description hash changed'],
    ['erp.ar', 'rung1 — Accounts receivable (ERPNext)', 'Accounts head', 'v6', 'Arjun Mehta', '2026-09-11', '0a7f', 'c6b3', 'tightened precondition (duplicate invoice number)'],
    ['erp.ar', 'rung1 — Accounts receivable (ERPNext)', 'Accounts head', 'v5', 'Arjun Mehta', '2026-09-04', '55d0', '19ea', 'added erp.credit_note.submit'],
    ['sales_invoice', 'rung1 — Sales invoicing (ERPNext)', 'Accounts head', 'v4', 'Arjun Mehta', '2026-09-18', '3b9e', 'c41d', 'dual control above ₹2 lakh'],
    ['erp.ap', 'rung1 — Accounts payable (ERPNext)', 'Finance manager', 'v5', 'Arjun Mehta', '2026-09-17', '92cc', '4e10', 'PO and GRN cross-check'],
    ['erp.stock', 'rung1 — Stock movements (ERPNext)', 'Stores head', 'v3', 'Arjun Mehta', '2026-09-12', 'c3a8', '77f2', 'whatsapp_approve on stock_entry'],
    ['platform', 'elan1 Platform', 'elan1 lead', 'v3', 'Kavya Menon', '2026-09-20', '1f06', 'ab54', 'break-glass declared']
  ];
  E1.route('/auditor/declarations', {
    title: 'Declaration versions', layout: 'bare', bareTitle: 'Auditor portal', keywords: 'declaration versions verbatim certified digest',
    render: function () {
      var tbl = c.table({ caption: 'Declaration versions in scope', columns: [
        { key: 'id', label: 'Declaration', mono: true, render: function (r) { return esc(r[0]) + ' <span class="e1-muted">' + esc(r[3]) + '</span>'; } },
        { key: 'name', label: 'Name', render: function (r) { return esc(r[1]) + '<div class="e1p-note">Owner role: ' + esc(r[2]) + '</div>'; } },
        { key: 'cert', label: 'Certified', render: function (r) { return esc(r[4]) + '<div class="e1p-note">' + esc(fmt.date(r[5])) + '</div>'; } },
        { key: 'dig', label: 'Compiled digest', render: function (r) { return c.hash(dig(r[6], r[7]), { label: 'Declaration digest' }); } },
        { key: 'chg', label: 'Change', render: function (r) { return esc(r[8]); } },
        { key: 'v', label: '', html: true, render: function (r, i) { return c.button('Verbatim', { size: 'sm', icon: 'file-text', attrs: 'data-action="p-decl" data-value="' + i + '"' }); } }
      ], rows: DECLS });
      return wrap(audBand('decl'),
        c.pageHeader({ title: 'Declaration versions, verbatim', eyebrow: 'Auditor portal', lead: 'Every rule set that governed a record in your range, at the version that governed it. Versions are forward-only; none is ever edited in place, and none is called “latest”.' }) + tbl +
        '<p class="e1p-note" style="margin-top:12px">Certifier is never the author. erp.ar v8 is a draft awaiting certification and governs no record yet.</p>');
    }
  });
  E1.action('p-decl', function (el) {
    var r = DECLS[Number(el.getAttribute('data-value'))];
    E1.drawer({ title: r[0] + ' ' + r[3].split(' ')[0], eyebrow: 'Declaration · verbatim', body: '<div class="e1-stack">' + c.kv([['Certified by', r[4] + ', ' + fmt.date(r[5])], ['Compiled digest', c.hash(dig(r[6], r[7])), { html: true }]], { compact: true }) +
      c.json({ identity: { id: r[0], version: Number(r[3].replace(/\D/g, '')), owner_role: r[2] }, shape: { objects: ['Sales Invoice', 'Customer', 'Payment Entry'] }, permissions: { grants: [{ actor: 'ar-agent', write_type: 'erp.sales_invoice.submit', autonomy: 'A2' }] }, write_types: [{ name: 'erp.sales_invoice.submit', blast_radius: 'one_counterparty', reversal: 'target_native_undo', dual_control: 'above ₹2,00,000' }], gates: ['consent', 'residency', 'retention', 'counterparty', 'precondition', 'dual_control', 'budget'], proof_binding: { fields: [] }, channels: [{ name: 'web', mode: 'enforced' }, { name: 'mcp', mode: 'enforced' }] }, { title: 'Seven blocks', open: 2 }) + '</div>' });
  });

  /* ---- Evidence requests ------------------------------------------------- */
  var REQ_ITEMS = [
    { id: 'range', label: 'Sequence range', note: 'A contiguous range with its first and last digest' },
    { id: 'continuity', label: 'Chain continuity report', note: 'continuous / break at record N / not checked, with scope and count' },
    { id: 'declarations', label: 'Declaration versions, verbatim', note: 'Every version that governed a record in range' },
    { id: 'nightly', label: 'Nightly integrity output', note: 'For every night in range' },
    { id: 'meter', label: 'Meter reconciliation', note: 'Both directions, with refusals at quantity 0' },
    { id: 'keypolicy', label: 'Key policy', note: 'Token classes, custody, rotation — at Level 1 there is no signing key' },
    { id: 'explanation', label: 'Explanation of an exception', note: 'The client answers in writing, on the record' },
    { id: 'extension', label: 'Extension of the access window', note: 'Approved by two people at the client' },
    { id: 'bundle', label: 'Evidence bundle', note: 'Signed, anchored, verifiable offline', L: 'L2' },
    { id: 'kms', label: 'KMS audit log extract', note: 'Sign calls, to reconcile against signed records yourself', L: 'L2' }
  ];
  var REQ_SEED = [
    { id: 'REQ-2026-0007', items: ['continuity'], purpose: 'Continuity report for the interim visit, 1–21 Sep.', at: '2026-09-22T10:14:00+05:30', status: 'provided', who: 'Venkat Raman' },
    { id: 'REQ-2026-0008', items: ['declarations'], purpose: 'All declaration versions in force during September.', at: '2026-09-22T10:16:00+05:30', status: 'provided', who: 'Venkat Raman' },
    { id: 'REQ-2026-0009', items: ['explanation'], ref: 'ACC-JV-2026-00412', purpose: 'Why was this journal entry edited in ERPNext outside the governed path?', at: '2026-09-23T11:02:00+05:30', status: 'waiting', who: 'Venkat Raman' }
  ];
  function requests() { return (E1.store.get('p.requests', []) || []).concat(REQ_SEED); }
  E1.route('/auditor/requests', {
    title: 'Evidence requests', layout: 'bare', bareTitle: 'Auditor portal', keywords: 'evidence request auditor',
    render: function (p, q) {
      var rows = q.state === 'empty' ? [] : requests();
      var tbl = c.table({ caption: 'Evidence requests', columns: [
        { key: 'id', label: 'Request', mono: true },
        { key: 'items', label: 'Asked for', render: function (r) { return esc(r.items.map(function (i) { var it = REQ_ITEMS.filter(function (x) { return x.id === i; })[0]; return it ? it.label : i; }).join(', ')) + (r.ref ? '<div class="e1p-note e1-mono">' + esc(r.ref) + '</div>' : ''); } },
        { key: 'purpose', label: 'Purpose' },
        { key: 'at', label: 'Sent', nowrap: true, render: function (r) { return esc(fmt.dateTime(r.at)); } },
        { key: 'status', label: 'Status', render: function (r) { return r.status === 'provided' ? c.badge('good', 'Provided') : r.status === 'waiting' ? c.badge('warning', 'Waiting on ' + (r.who || 'a person')) : c.badge('info', 'Recorded — with the client'); } }
      ], rows: rows, empty: { icon: 'send', title: 'You have not asked the client for anything yet.', why: 'Everything in the five asks is already in the portal. A request is for a different form, a different range, or an explanation.', action: { label: 'New request', href: '#/auditor/requests/new' } } });
      return wrap(audBand('requests', [{ label: 'With requests', href: '#/auditor/requests' }, { label: 'No requests yet', href: '#/auditor/requests?state=empty' }]),
        c.pageHeader({ title: 'Evidence requests', eyebrow: 'Auditor portal', lead: 'Each request is a governed write in the client\'s chain, answered by a named person there.', actions: c.button('New request', { kind: 'primary', icon: 'plus', href: '#/auditor/requests/new' }) }) + tbl);
    }
  });
  E1.route('/auditor/requests/new', {
    title: 'Request evidence', layout: 'bare', bareTitle: 'Auditor portal', keywords: 'evidence request form',
    render: function (p, q) {
      var pre = String(q.item || '').split(',');
      var items = REQ_ITEMS.map(function (it) {
        var locked = it.L && !E1.atLeast(it.L);
        return c.checkbox({ id: 'p-it-' + it.id, name: 'item', value: it.id, label: it.label + (it.L ? ' · ' + it.L : ''), note: locked ? 'Arrives at Level 2 Attested — the client runs at ' + lvlName(E1.state.level) + '.' : it.note, checked: pre.indexOf(it.id) >= 0 && !locked, disabled: locked });
      }).join('');
      var ref = q.ref ? decodeURIComponent(q.ref) : '';
      var form = '<form class="e1-stack" data-p-form="request" novalidate>' +
        '<fieldset style="border:0;padding:0;margin:0"><legend class="e1-field__label" style="margin-bottom:8px">What do you need? <span class="e1-field__req" aria-hidden="true">*</span></legend><div class="e1p-grid e1p-grid--2" id="p-items">' + items + '</div><p class="e1-field__help" id="p-items-msg">Choose at least one.</p></fieldset>' +
        '<div class="e1p-grid e1p-grid--3">' + c.field('From seq', c.input({ id: 'p-from', mono: true, value: q.from || '1', attrs: 'inputmode="numeric"' }), { id: 'p-from' }) + c.field('To seq', c.input({ id: 'p-to', mono: true, value: q.to || String(AUD.head), attrs: 'inputmode="numeric"' }), { id: 'p-to' }) + c.field('Needed by', c.input({ id: 'p-due', type: 'date', value: '2026-10-01' }), { id: 'p-due' }) + '</div>' +
        (ref ? c.field('About', c.input({ id: 'p-ref', mono: true, value: ref, readonly: true }), { id: 'p-ref', help: 'From your reconciliation or a record you were viewing.' }) : '') +
        c.field('Purpose', c.textarea({ id: 'p-purpose', rows: 3, describedBy: 'p-purpose-msg', value: ref ? 'Please explain ' + ref + ': who made the change, why it did not go through the governed path, and whether it was approved.' : '' }), { id: 'p-purpose', required: true, help: 'One or two sentences. The client sees exactly this. At least 12 characters.' }) +
        c.field('Deliver to', c.select({ id: 'p-deliver', options: [{ value: 'portal', label: 'This portal (recommended)' }, { value: 'email', label: 'lakshmi.iyer@iyermenon.example' }] }), { id: 'p-deliver' }) +
        '<div class="e1-row" style="gap:8px">' + c.button('Send request', { kind: 'primary', type: 'submit', icon: 'send' }) + c.button('Cancel', { kind: 'ghost', href: '#/auditor/requests' }) + '</div></form>';
      return wrap(audBand('requests'),
        c.pageHeader({ title: 'Request evidence', eyebrow: 'Auditor portal · ' + AUD.eng.id, back: ['Evidence requests', '#/auditor/requests'], lead: 'Sending creates a governed write in Kaveri\'s chain. A named person there answers it; you will see who and when.' }) +
        '<div class="e1p-main-side"><div>' + c.card({ body: form }) + '</div><div class="e1-stack">' +
        c.callout({ kind: 'info', title: 'What happens next.', body: '<p>The request is recorded as <code>platform.evidence.request</code>, routed to Venkat Raman (evidence owner) and visible to Meenakshi Iyer (owner). Provided evidence appears under Requests.</p>' }) +
        c.card({ title: 'You never need to ask for', body: '<ul class="e1p-fields"><li>The verifier — it is free, to anyone</li><li>Payloads, salts or key material — never in any export</li><li>A copy of a bundle we kept — we keep none</li></ul>' }) + '</div></div>');
    },
    mount: function (el) {
      var f = sel('[data-p-form="request"]', el);
      if (!f) return;
      f.addEventListener('submit', function (e) {
        e.preventDefault();
        var its = selAll('input[name="item"]:checked', f).map(function (x) { return x.value; });
        var msg = sel('#p-items-msg', f);
        if (!its.length) { msg.className = 'e1-field__error'; msg.innerHTML = c.icon('alert', 12) + '<span>Choose at least one thing to ask for.</span>'; msg.setAttribute('role', 'alert'); sel('#p-items input:not([disabled])', f).focus(); return; }
        var pur = sel('#p-purpose', f), v = String(pur.value || '').trim();
        if (v.length < 12) { showFieldError(pur, 'Write at least 12 characters, so the client knows what you need and why.'); return; }
        var list = E1.store.get('p.requests', []) || [];
        var id = 'REQ-2026-' + String(10 + list.length).padStart(4, '0');
        list.unshift({ id: id, items: its, ref: (sel('#p-ref', f) || {}).value || '', purpose: v, at: new Date().toISOString(), status: 'recorded' });
        E1.store.set('p.requests', list);
        E1.toast('Recorded in Kaveri\'s chain as platform.evidence.request and sent to Venkat Raman.', 'good', { title: id + ' sent' });
        E1.go('/auditor/requests');
      });
    }
  });

  /* ---- Evidence bundle (L2) ---------------------------------------------- */
  var BUNDLE = {
    id: 'EB-2027-0007', name: 'kaveri-ledger1-2027-07-01_2027-10-26', format: 'elan1.evidence.bundle.v1', from: 41207, to: 53686, count: 12480, refusals: 611, unanchored: 22,
    exported: '2027-10-26T10:42:17Z', by: 'Venkat Raman', profile: 'in-mca-audit-trail v1', redaction: 'ledger1-default', verifier: dig('0d7c', '55a1'), digest: dig('4be1', '90cf'),
    members: [['manifest.json', '6,212'], ['seals.jsonl', '79,87,200'], ['chain.json', '3,418'], ['anchors/ (1,081 files)', '1,82,40,512'], ['keys.json', '1,104'], ['declarations/ (v7, v8, v9)', '2,11,906'], ['lexicon/ (2 digests)', '48,330'], ['VERIFY.txt', '9,870']]
  };
  E1.route('/auditor/bundle/:id', {
    title: function (p) { return 'Evidence bundle ' + p.id; }, layout: 'bare', bareTitle: 'Auditor portal', example: '/auditor/bundle/EB-2027-0007', keywords: 'bundle evidence manifest verify offline',
    render: function (p, q) {
      var lock = portalLock('L2', { who: 'Your client', title: 'Evidence bundles arrive at Level 2 Attested', why: 'At Level 1 there is no signed bundle to export. The client can export the hash-chained log for their own review; a third party would have to trust our infrastructure to rely on it.', items: ['Eight members, self-contained, inert and claim-bearing', 'Ed25519 signatures and RFC 3161 anchors from two authorities', 'A manifest you check member by member, then the offline verifier'], today: 'Use the Level 1 checklist and the two-way reconciliation.', alt: ['Open the Level 1 checklist', '#/auditor/checklist'] });
      if (lock) return wrap(audBand('bundle'), c.pageHeader({ title: 'Evidence bundle ' + p.id, eyebrow: 'Auditor portal · Level 2 Attested' }) + lock);
      if (p.id !== BUNDLE.id) {
        return wrap(audBand('bundle'), c.pageHeader({ title: 'Bundle ' + p.id + ' is not in your engagement', eyebrow: 'Auditor portal', back: ['Engagement', '#/auditor'] }) +
          c.empty({ icon: 'package', title: 'No bundle with that id was handed to you.', why: 'We keep no bundles — each export is generated on request and handed over. The only bundle in ENG-2026-014 is EB-2027-0007.', action: [{ label: 'Open EB-2027-0007', href: '#/auditor/bundle/EB-2027-0007' }, { label: 'Request a bundle', href: '#/auditor/requests/new?item=bundle', kind: 'ghost' }] }));
      }
      var B = BUNDLE, attached = E1.store.get('p.bundle.report', null);
      var seg = '<div class="e1p-seg" role="img" aria-label="Level 1: seq 1 to 41,206; Level 2: seq 41,207 to 53,686"><span class="e1p-seg__l1" style="flex:41206">L1 · #1–#41,206 · 41,206 records</span><span class="e1p-seg__l2" style="flex:12480">L2 · #41,207–#53,686 · 12,480</span></div><p class="e1p-note" style="margin-top:8px">Records from 12 August 2027 are signed; the 41,206 records before that date are Level 1 and are labelled so. This bundle covers the Level 2 range only.</p>';
      var manifest = c.kv([
        ['bundle_format', B.format, { mono: true }], ['tenant_id', D.tenant.tenantId, { mono: true }], ['seq_from · seq_to', '<a class="e1p-num" href="#/auditor/records?from=' + B.from + '&to=' + B.to + '">' + n(B.from) + ' · ' + n(B.to) + '</a>', { html: true }],
        ['record_count', '<a class="e1p-num" href="#/auditor/records?from=' + B.from + '&to=' + B.to + '">' + n(B.count) + '</a> <span class="e1p-note">= seq_to − seq_from + 1</span>', { html: true }],
        ['refusal_count', '<a class="e1p-num" href="#/auditor/records?from=' + B.from + '&to=' + B.to + '&outcome=refused">' + n(B.refusals) + '</a>', { html: true }],
        ['assurance_levels', '[{ level: 2, count: 12,480, seq: 41,207–53,686 }]', { mono: true }], ['continuity_scope', 'full_chain', { mono: true }], ['profile', B.profile, { mono: true }], ['redaction_profile', B.redaction, { mono: true }],
        ['unanchored_head', '<a class="e1p-num" href="#/auditor/records?from=53665&to=53686">' + B.unanchored + '</a> <span class="e1p-note">0 is a value, not an absence</span>', { html: true }],
        ['exported_at', B.exported, { mono: true }], ['verifier_digest', c.hash(B.verifier, { label: 'Verifier digest' }), { html: true }]
      ], { compact: true, cols: 2 });
      var members = c.table({ caption: 'Bundle members', dense: true, columns: [{ key: 0, label: 'Member', mono: true }, { key: 1, label: 'Bytes', align: 'right', mono: true }, { key: 2, label: 'SHA-256', html: true }], rows: B.members.map(function (m) { return { 0: m[0], 1: m[1], 2: c.hash(hx('m' + m[0], 64), { label: m[0] }) }; }) });
      var report = attached ? c.card({ title: 'Your verification report', eyebrow: 'Submitted by the reader; elan1 did not run this', body: verdictBlock(code('pass')) + '<p class="e1p-note" style="margin-top:10px">Attached ' + esc(fmt.dateTime(attached.at)) + ' · ' + esc(attached.name) + ' · <a href="#/verify/result?code=pass&id=EB-2027-0007">Read the nine sections</a></p>' + '<div style="margin-top:10px">' + c.button('Remove attachment', { size: 'sm', kind: 'ghost', attrs: 'data-action="p-unattach"' }) + '</div>' })
        : c.card({ title: 'Attach your verification report', eyebrow: 'Optional', body: '<p class="e1p-note" style="margin:0 0 12px">The verifier records nothing and phones home to no one. If you want the client to see that you ran it, attach the report it wrote. It is shown as submitted by you.</p><label class="e1p-drop"><span class="e1p-rows__icon">' + c.icon('upload', 16) + '</span><span class="e1p-rows__main"><span class="e1p-rows__t">Choose report-EB-2027-0007.txt</span></span><input type="file" id="p-attach" accept=".txt"><span class="e1-btn e1-btn--secondary e1-btn--sm" aria-hidden="true"><span>Choose</span></span></label><div style="margin-top:10px">' + c.button('Attach the sample report', { size: 'sm', kind: 'ghost', attrs: 'data-action="p-attach"' }) + '</div>' });
      return wrap(audBand('bundle'),
        previewNote('L2') + (E1.state.level !== 'L1' ? '<div class="e1p-gap"></div>' : '') +
        c.pageHeader({ title: 'Evidence bundle ' + B.id, eyebrow: 'Auditor portal · ' + lvlName('L2'), lead: 'Export ready — 12,480 records, 611 refusals, 22 unanchored, profile in-mca-audit-trail v1.',
          actions: c.button('Download bundle', { kind: 'primary', icon: 'download', attrs: 'data-action="p-download" data-value="' + B.name + '.tar"' }) + c.button('Ask for a re-export', { icon: 'refresh', href: '#/auditor/requests/new?item=bundle&from=' + B.from + '&to=' + B.to }),
          meta: c.level('L2') + '<span class="e1p-fact">' + c.icon('hash', 14) + '<span>Bundle digest ' + c.hash(B.digest, { label: 'Bundle digest' }) + '</span></span><span class="e1p-fact">' + c.icon('user', 14) + '<span>Exported by ' + esc(B.by) + ' · ' + esc(fmt.dateTime(B.exported)) + '</span></span><span class="e1p-fact">' + c.icon('timer', 14) + '<span>Download link expires in 24 h — we retain no bundles</span></span>' }) +
        seg + '<div class="e1p-gap"></div>' +
        '<div class="e1p-main-side"><div>' +
        c.section({ id: 'verify', title: 'Verify it yourself, offline', body: '<ol class="e1p-steps"><li><div><h3>Get the verifier from your own source</h3><p>Not from the client and not from this page. Check its digest against SHA256SUMS: the bundle names verifier_digest ' + c.hash(B.verifier, { copy: false }) + '.</p>' + c.button('Verifier releases', { size: 'sm', href: '#/verify/releases' }) + '</div></li><li><div><h3>Obtain the key fingerprint out of band</h3><p>From the signed notice the client forwarded you, or the page handed to you at the opening meeting. This portal will not fill it in for you.</p></div></li><li><div><h3>Disconnect and run</h3>' + c.code('elan1-verify --bundle ' + B.name + '.tar \\\n  --profile in-mca-audit-trail-v1.json \\\n  --key-fingerprint <the fingerprint from your own source>', 'shell', { title: 'Terminal · offline' }) + '</div></li><li><div><h3>Then run the tampered bundle</h3><p>Watch the same binary exit 1 FAIL_INTEGRITY and name the record and field.</p>' + c.button('The tampered bundle', { size: 'sm', href: '#/verify/tampered' }) + '</div></li></ol>' }) +
        c.section({ id: 'manifest', title: 'Manifest', lead: 'The manifest is not signed as a whole; every member it lists is digested, and the records inside are signed.', body: manifest }) +
        c.section({ id: 'members', title: 'Members', body: members + '<p class="e1p-note" style="margin-top:8px">Excluded by design: payloads, salts, key material, any executable, target-system state.</p>' }) +
        c.section({ id: 'limits', title: 'What a PASS does not establish', body: '<blockquote class="e1p-quote">' + esc(LIMITS_MCA) + '<cite>limits_statement · in-mca-audit-trail v1 · verbatim</cite></blockquote>' }) +
        '</div><div class="e1-stack">' + report +
        c.card({ title: 'Keys in this bundle', body: c.kv([['key_id', 'k_in_20270701_4d7e', { mono: true }], ['Status', 'active'], ['Window', '2027-07-01T00:00:00Z → —', { mono: true }], ['Custody', 'AWS KMS · ap-south-1 · one key per residency domain']], { compact: true }) + '<p class="e1p-note" style="margin-top:8px">This key also signs other tenants\' records in domain in. The fingerprint is never taken from keys.json.</p>' }) +
        c.card({ title: 'Anchors', body: c.kv([['Batches', '818 anchored · 1 single_anchor'], ['Authorities', 'eMudhra (India) and DigiCert'], ['Unanchored at export', '22 records']], { compact: true }) + '<p class="e1p-note" style="margin-top:8px">An anchor is an upper bound on time: existence, form, and no later than.</p>' }) + '</div></div>');
    },
    mount: function (el) { var f = sel('#p-attach', el); if (f) f.addEventListener('change', function () { if (f.files && f.files[0]) attachReport(f.files[0].name); }); }
  });
  function attachReport(name) { E1.store.set('p.bundle.report', { name: name || 'report-EB-2027-0007.txt', at: new Date().toISOString() }); E1.render({ keepScroll: true }); E1.toast('Shown to the client as submitted by you. elan1 did not run it.', 'good', { title: 'Report attached' }); }
  E1.action('p-attach', function () { attachReport('report-EB-2027-0007.txt'); });
  E1.action('p-unattach', function () { E1.store.set('p.bundle.report', null); E1.render({ keepScroll: true }); });

  /* ---- ledger1 pilot (L2) ------------------------------------------------ */
  var PILOT = { id: 'PL-2027-01', day: 76, of: 90, start: '2027-08-11' };
  function pilotDay(d) { return new Date(new Date(PILOT.start + 'T10:00:00+05:30').getTime() + d * 86400000).toISOString(); }
  E1.route('/auditor/pilot/:id', {
    title: function (p) { return 'ledger1 pilot ' + p.id; }, layout: 'bare', bareTitle: 'Auditor portal', example: '/auditor/pilot/PL-2027-01', keywords: 'pilot statement verdict ledger1 day 0 day 80',
    render: function (p, q) {
      var lock = portalLock('L2', { who: 'Your client', title: 'The ledger1 pilot starts at Level 2 Attested', why: 'The pilot tests whether you can rely on a bundle you verified yourself. It begins with the client\'s upgrade to Level 2 on Day 1; until then there is nothing for you to verify offline.', items: ['Day 0: your three questions and what you would need to see', 'Day 77: you verify the bundle yourself, offline — we are not in the room', 'Day 80: your written verdict, in your own words'], alt: ['Open the Level 1 checklist', '#/auditor/checklist'] });
      if (lock) return wrap(audBand('pilot'), c.pageHeader({ title: 'ledger1 pilot ' + p.id, eyebrow: 'Auditor portal · Level 2 Attested' }) + lock);
      if (p.id !== PILOT.id) return wrap(audBand('pilot'), c.pageHeader({ title: 'No pilot ' + p.id, eyebrow: 'Auditor portal', back: ['Engagement', '#/auditor'] }) + c.empty({ icon: 'flag', title: 'You are not part of a pilot with that id.', why: 'Pilots are once per company and at most five run at a time. Your firm\'s pilot with Kaveri Spinning Mills is PL-2027-01.', action: { label: 'Open PL-2027-01', href: '#/auditor/pilot/PL-2027-01' } }));
      var tab = q.tab || 'overview';
      var v = E1.store.get('p.verdict', null);
      var tabs = c.tabs([{ id: 'overview', label: 'Overview', href: '#/auditor/pilot/' + p.id }, { id: 'statement', label: 'Day 0 statement', href: '#/auditor/pilot/' + p.id + '?tab=statement' }, { id: 'verdict', label: 'Day 80 verdict', href: '#/auditor/pilot/' + p.id + '?tab=verdict' }], tab, { label: 'Pilot sections' });
      var head = c.pageHeader({ title: 'ledger1 pilot · Kaveri Spinning Mills', eyebrow: 'Auditor portal · ' + p.id + ' · ' + lvlName('L2'), lead: 'Ninety days, one customer, one auditor, one obligation: the MCA audit-trail rule, in force since 1 April 2023. Your firm is the auditor.',
        meta: c.level('L2') + '<span class="e1p-fact">' + c.icon('calendar', 14) + '<span>Day <strong>' + PILOT.day + '</strong> of ' + PILOT.of + ' · started ' + esc(fmt.date(PILOT.start)) + '</span></span><span class="e1p-fact">' + c.icon('flag', 14) + '<span>Written verdict due Day 80 · ' + esc(fmt.date(pilotDay(80))) + '</span></span>' });
      var body;
      if (tab === 'statement') {
        body = '<div class="e1p-main-side"><div class="e1-stack">' + c.card({ title: 'Your three questions', eyebrow: 'Recorded Day 0 · ' + fmt.date(pilotDay(0)), body: '<ol style="margin:0;padding-left:20px;line-height:1.7"><li>Can I show that no change reached the books of account without appearing in the trail?</li><li>Can I tell software changes from people\'s changes without asking the client?</li><li>If a record were altered after the fact, would I know — without the vendor telling me?</li></ol>' }) +
          c.card({ title: 'What you would need to see to rely on a record of this kind', eyebrow: 'Not what would be nice — what would be necessary', body: '<blockquote class="e1p-quote">A trail I can check on my own machine, with software I did not get from the client, that includes the refused attempts, names the actor and says whether it was a person, and that tells me plainly what it does not cover. I would also need the ERPNext audit trail for the same period to find changes made outside the system.<cite>CA Lakshmi Iyer, 11 Aug 2027 · recorded verbatim</cite></blockquote>' }) +
          c.section({ id: 'map', title: 'How your statement was mapped to the profile', lead: 'Each need became a profile row, or a not_measurable row that says what would change it.', body: c.table({ caption: 'Statement to profile rows', dense: true, columns: [{ key: 'need', label: 'Your need' }, { key: 'row', label: 'Profile row', mono: true }, { key: 'd', label: 'Disposition', html: true }], rows: [
            { need: 'Refused attempts included', row: 'C01 · refusals_required: true', d: c.badge('good', 'bound') }, { need: 'Actor and person-or-software', row: 'C02 · F09, F10', d: c.badge('good', 'bound') },
            { need: 'Alteration detectable without the vendor', row: 'C05, C06 · F02, F03 + anchors', d: c.badge('good', 'bound') },
            { need: 'Changes made outside the system', row: 'not_measurable', d: c.badge('neutral', 'not_measurable') + '<div class="e1p-note">Would change if: ERPNext\'s own trail were ingested as a second source (E11 test 3 covers it today).</div>' }
          ] }) }) + '</div><div class="e1-stack">' + c.callout({ kind: 'info', title: 'Your words stay yours.', body: '<p>The statement is recorded verbatim and is not edited. It is never quoted outside the pilot.</p>' }) + '</div></div>';
      } else if (tab === 'verdict') {
        if (v) {
          body = c.card({ title: 'Your written verdict', eyebrow: 'Submitted ' + fmt.dateTime(v.at), body: '<div class="e1-row" style="gap:8px;margin-bottom:12px">' + (v.outcome === 'accepted_in_writing' ? c.badge('good', 'Accepted in writing') : c.badge('serious', 'Objection in writing')) + c.badge('neutral', 'Would ask a client to buy it: ' + v.buy, { subtle: true }) + '</div><blockquote class="e1p-quote">' + esc(v.text) + '<cite>' + esc(AUD.person) + ' · published internally, verbatim</cite></blockquote><div style="margin-top:12px">' + c.button('Withdraw and rewrite', { size: 'sm', kind: 'ghost', attrs: 'data-action="p-verdict-reset"' }) + '</div>' });
        } else {
          body = '<div class="e1p-main-side"><div>' + c.card({ title: 'Day 80 — your written verdict', body: '<form class="e1-stack" data-p-form="verdict" novalidate>' +
            c.field('In your own words: what would the bundle let you conclude, and what would it not?', c.textarea({ id: 'p-vtext', rows: 7, describedBy: 'p-vtext-msg' }), { id: 'p-vtext', required: true, help: 'At least 12 characters. Published internally, verbatim. Never quoted in marketing.' }) +
            '<fieldset style="border:0;margin:0;padding:0"><legend class="e1-field__label">Would you ask a client to buy it?</legend><div class="e1-row" style="gap:16px;margin-top:6px">' + c.radio({ name: 'p-buy', value: 'Yes', label: 'Yes' }) + c.radio({ name: 'p-buy', value: 'No', label: 'No' }) + c.radio({ name: 'p-buy', value: 'Not yet', label: 'Not yet', checked: true }) + '</div></fieldset>' +
            '<fieldset style="border:0;margin:0;padding:0"><legend class="e1-field__label">Outcome <span class="e1-field__req" aria-hidden="true">*</span></legend><div class="e1-stack" style="margin-top:6px">' + c.radio({ name: 'p-out', value: 'accepted_in_writing', label: 'A written acceptance', note: 'You relied on the bundle and would ask for one again.' }) + c.radio({ name: 'p-out', value: 'objection_in_writing', label: 'A written objection', note: 'Say what would have to change.' }) + '</div><p class="e1-field__help" id="p-out-msg">Choose one.</p></fieldset>' +
            c.button('Submit verdict', { kind: 'primary', type: 'submit' }) + '</form>' }) + '</div><div class="e1-stack">' +
            c.callout({ kind: 'rule', title: 'What we will not ask.', body: '<p>For an endorsement, for a logo, for a quotation.</p>' }) +
            c.card({ title: 'Before you write', body: '<ul class="e1p-fields"><li>Day 77: you verified EB-2027-0007 offline ' + c.badge('good', 'done', { subtle: true }) + '</li><li>Day 77: you ran the tampered bundle ' + c.badge('good', 'done', { subtle: true }) + '</li><li>Day 78: test 3 on real data ' + c.badge('good', 'done', { subtle: true }) + '</li></ul>' }) + '</div></div>';
        }
      } else {
        var tl = [
          [0, 'Day 0 · your half day', 'Three questions and the necessity statement.', 'good', '?tab=statement'],
          [1, 'Day 1 · client upgraded to Level 2', 'Signing on at seq 41,207 · 41,206 records at Level 1 · 0 at Level 2.', 'good'],
          [2, 'Days 2–75 · normal operation', 'Refusals are part of the test. 611 refused in the Level 2 range.', 'good'],
          [76, 'Day 76 · the client exports, without help', 'EB-2027-0007. Needing help would have been a finding.', 'info', '#/auditor/bundle/EB-2027-0007'],
          [77, 'Day 77 · you verify offline, then the tampered bundle', 'We are not in the room.', 'neutral', '#/verify'],
          [78, 'Day 78 · test 3 on real data', 'The chain against the ERPNext audit trail.', 'neutral', '#/auditor/reconciliation'],
          [80, 'Day 80 · your written verdict', 'Published internally, verbatim.', v ? 'good' : 'neutral', '?tab=verdict'],
          [85, 'Day 85 · the G-D question', '“Would you pay for this on its own line, separately from the software?” — asked of the client.', 'neutral']
        ].map(function (x) { return { time: fmt.date(pilotDay(x[0])), title: x[1], body: x[2], state: x[3], href: x[4] ? (x[4].charAt(0) === '?' ? '#/auditor/pilot/' + p.id + x[4] : x[4]) : undefined }; });
        var tests = c.table({ caption: 'Pack tests T1–T8', dense: true, columns: [{ key: 't', label: 'Test', mono: true, width: '56px' }, { key: 'n', label: 'Name' }, { key: 's', label: 'State', html: true }, { key: 'e', label: 'Evidence' }], rows: [
          { t: 'T1', n: 'Declaration validates', s: c.badge('good', 'pass'), e: 'erp.ar v9' }, { t: 'T2', n: 'Profile certified', s: c.badge('good', 'pass'), e: 'author Rohan Kapoor · certifier Kavya Menon' },
          { t: 'T3', n: 'Reversal is honest', s: c.badge('good', 'pass'), e: 'drill 22 Jul 2027 · compensating_instrument on JE-2027-00841' }, { t: 'T4', n: 'Refusals are real', s: c.badge('good', 'pass'), e: '7 gates · 7 fixture refusals' },
          { t: 'T5', n: 'Bundle verifies offline', s: c.badge('good', 'pass'), e: 'EB-2027-0007' }, { t: 'T6', n: 'Tampered bundle refuses', s: c.badge('good', 'pass'), e: 'exit 1 at seq 3,181' },
          { t: 'T7', n: 'Non-conforming bundle is not accused', s: c.badge('good', 'pass'), e: 'exit 2, never 1' }, { t: 'T8', n: 'The auditor reads it', s: v ? c.badge('good', 'answered') : c.badge('warning', 'pending — Day 80'), e: 'your verdict' }
        ] });
        body = '<div class="e1p-main-side"><div>' + c.section({ id: 'protocol', title: 'Protocol', body: c.timeline(tl) }) + c.section({ id: 'tests', title: 'Pack tests', body: tests }) + '</div><div class="e1-stack">' +
          c.card({ title: 'What we ask of you', body: '<ol style="margin:0;padding-left:18px;line-height:1.7"><li>Half a day at the start</li><li>A written statement of what you would need</li><li>Run test 3 on real data</li><li>Tell us where the language is wrong</li></ol>' }) +
          c.callout({ kind: 'rule', title: 'What we will not ask.', body: '<p>For an endorsement, for a logo, for a quotation.</p>' }) +
          c.card({ title: 'If you will not run the verifier', body: '<p class="e1p-note" style="margin:0">Then the pilot has failed its main purpose — and we will record it that way, not as your failure.</p>' }) + '</div></div>';
      }
      return wrap(audBand('pilot'), previewNote('L2') + (E1.state.level !== 'L1' ? '<div class="e1p-gap"></div>' : '') + head + tabs + '<div class="e1p-gap"></div>' + body);
    },
    mount: function (el) {
      var f = sel('[data-p-form="verdict"]', el);
      if (!f) return;
      f.addEventListener('submit', function (e) {
        e.preventDefault();
        var t = sel('#p-vtext', f), txt = String(t.value || '').trim();
        if (txt.length < 12) { showFieldError(t, 'Write at least 12 characters — a verdict is a sentence, not a tick.'); return; }
        var out = sel('input[name="p-out"]:checked', f);
        if (!out) { var m = sel('#p-out-msg', f); m.className = 'e1-field__error'; m.setAttribute('role', 'alert'); m.innerHTML = c.icon('alert', 12) + '<span>Choose acceptance or objection. Both are useful outcomes.</span>'; return; }
        var buy = (sel('input[name="p-buy"]:checked', f) || {}).value || 'Not yet';
        E1.confirm({ title: 'Submit your verdict?', body: '<p>It is published internally, verbatim, and recorded as the answer to pack test T8. You can withdraw it and write again before Day 85.</p>', confirmLabel: 'Submit verdict', onConfirm: function () {
          E1.store.set('p.verdict', { text: txt, outcome: out.value, buy: buy, at: new Date().toISOString() }); E1.toast('Recorded verbatim. Thank you — this is the point of the pilot.', 'good', { title: 'Verdict submitted' }); E1.render();
        } });
      });
    }
  });
  E1.action('p-verdict-reset', function () { E1.store.set('p.verdict', null); E1.render(); });

  /* ==========================================================================
     REGULATOR VIEW  (/regulator…) — selective disclosure received; no approval claims
     ========================================================================== */
  var REG = D.regulator = {
    org: 'Sample supervisory authority — examination team', mark: 'EX', person: 'R. Krishnan, examiner',
    disclosures: [
      { id: 'DS-2028-0003', from: 'Kaveri Spinning Mills Pvt Ltd', tenant: 'kaveri-spinning', org: 'ar-org:kaverispinning.example', received: '2028-03-14T12:05:00+05:30', seqFrom: 71004, seqTo: 77950, records: 6947, refusals: 318, profile: 'in-mca-audit-trail v1', dprofile: 'regulator-statutory', revealed: 4, total: 11, agent: 5112, person: 1690, system: 145, run: null, by: 'Meenakshi Iyer (owner)' },
      { id: 'DS-2028-0001', from: 'Deccan Auto Components Pvt Ltd', tenant: 'deccan-auto', org: 'ar-org:deccanauto.example', received: '2028-02-02T16:40:00+05:30', seqFrom: 30112, seqTo: 33480, records: 3369, refusals: 141, profile: 'in-mca-audit-trail v1', dprofile: 'regulator-statutory', revealed: 4, total: 11, agent: 2210, person: 1101, system: 58, run: 'pass', by: 'Deccan Auto Components compliance head' }
    ],
    fields: [
      { f: 'invoice_no', cls: 'identifier', rev: true, ex: 'SINV-2028-00412' }, { f: 'posting_date', cls: 'date', rev: true, ex: '2028-03-11' },
      { f: 'grand_total', cls: 'amount', rev: true, ex: '₹27,64,300' }, { f: 'tax_total', cls: 'amount', rev: true, ex: '₹4,21,673' },
      { f: 'party_gstin', cls: 'identifier', rev: false }, { f: 'party_name', cls: 'business', rev: false }, { f: 'item_lines', cls: 'commercial', rev: false },
      { f: 'payment_terms', cls: 'commercial', rev: false }, { f: 'bank_account', cls: 'confidential', rev: false }, { f: 'narration', cls: 'free text', rev: false }, { f: 'approver_note', cls: 'personal', rev: false }
    ]
  };
  function regBand(active, states) {
    return band({
      portal: 'Regulator view', mark: REG.mark, viewer: [REG.person, 'Read-only'], eyebrow: 'Regulator view · signed in', org: REG.org, sub: 'Signed in as ' + REG.person + ' · read-only · sample organisation',
      facts: [
        { icon: 'scale', html: 'No regulator has reviewed or approved elan1' },
        { icon: 'user', html: 'elan1 contact: the founder, with Arjun Mehta (elan1 lead) for technical detail' },
        { icon: 'clock', html: 'Defect reports acknowledged within <strong>5 working days</strong>' }
      ],
      tools: levelMenu('Disclosers at') + statesMenu(states) + sandboxTag(),
      tabs: [
        { id: 'home', label: 'Overview', href: '#/regulator', icon: 'home' },
        { id: 'disc', label: 'Disclosures received', href: '#/regulator/disclosure/DS-2028-0003', icon: E1.atLeast('L3') ? 'eye' : 'lock' },
        { id: 'check', label: 'Check it without us', href: '#/regulator/check', icon: 'terminal' },
        { id: 'log', label: 'Engagement log', href: '#/regulator/log', icon: 'history' }
      ], active: active
    });
  }
  var LIMITS_TABLE = [
    ['The change went through the elan1 governed write path, under the declaration and policy versions named', 'That the transaction was genuine'],
    ['Who asked — a named actor — and whether a person, software or a scheduled system', 'That the rules applied were adequate'],
    ['Where a person approved, which person, as its own record', 'That the books are complete: changes made outside this path are not here'],
    ['The refused attempts, in full, with the rule that refused them', 'That any obligation is satisfied — that belongs to the reader'],
    ['That the sequence is unbroken and, from Level 2, signed and externally anchored', 'That any regulator has reviewed or accepted this reading of a rule']
  ];
  function limitsTable() {
    return '<div class="e1-table-wrap"><table class="e1-table"><caption class="e1-sr">What a record establishes and what it does not</caption><thead><tr><th scope="col">A record establishes</th><th scope="col">It does not establish</th></tr></thead><tbody>' +
      LIMITS_TABLE.map(function (r) { return '<tr><td>' + esc(r[0]) + '</td><td>' + esc(r[1]) + '</td></tr>'; }).join('') + '</tbody></table></div>';
  }
  function discById(id) { for (var i = 0; i < REG.disclosures.length; i++) if (REG.disclosures[i].id === id) return REG.disclosures[i]; return null; }
  E1.route('/regulator', {
    title: 'Regulator view', layout: 'bare', bareTitle: 'Regulator view', keywords: 'regulator supervisor disclosure examination reviewer',
    render: function (p, q) {
      var states = [{ label: 'With disclosures', href: '#/regulator' }, { label: 'No disclosures yet', href: '#/regulator?state=empty' }];
      var rows = q.state === 'empty' ? [] : REG.disclosures;
      var discTbl = portalLock('L3', { who: 'The companies disclosing to you', title: 'Field-by-field disclosure arrives at Level 3 Proven', why: 'At Level 3 a company can reveal to you exactly the fields a regime needs and keep the rest as commitments, and you can verify what you were given. At Level 2 an export carries one redaction profile for everyone; at Level 1 there is nothing a stranger can verify.', items: ['What was revealed, what was withheld, and why', 'A verifier run on your own machine, with a fingerprint you obtained yourself', 'An engagement log in which every interaction is a governed write'], today: 'The claim, the limits and the self-checks below are true at every level.' }) ||
        c.table({ caption: 'Disclosures received', rowHref: function (r) { return '#/regulator/disclosure/' + r.id; }, columns: [
          { key: 'id', label: 'Disclosure', mono: true },
          { key: 'from', label: 'From', render: function (r) { return esc(r.from) + '<div class="e1p-note e1-mono">' + esc(r.org) + '</div>'; } },
          { key: 'range', label: 'Range', render: function (r) { return '<span class="e1-mono">#' + n(r.seqFrom) + '–#' + n(r.seqTo) + '</span><div class="e1p-note">' + n(r.records) + ' records · ' + n(r.refusals) + ' refused</div>'; } },
          { key: 'rev', label: 'Revealed', render: function (r) { return '<span class="e1-mono">' + r.revealed + ' of ' + r.total + '</span> committed fields<div class="e1p-note e1-mono">' + esc(r.dprofile) + '</div>'; } },
          { key: 'received', label: 'Received', nowrap: true, render: function (r) { return esc(fmt.date(r.received)); } },
          { key: 'run', label: 'Your verification', render: function (r) { return r.run ? c.badge('good', '0 PASS · reported by you') : c.badge('neutral', 'Not run yet'); } }
        ], rows: rows, empty: { icon: 'eye', title: 'No company has disclosed anything to you through elan1.', why: 'A disclosure is made by the company, not by elan1 — usually because you asked for it in a supervisory conversation.', fill: 'When one arrives it appears here with what was revealed, what was withheld, and how to check it.', action: { label: 'How checking works', href: '#/regulator/check' } } });
      return wrap(regBand('home', states),
        c.pageHeader({ title: 'What you have received, and how to check it without us', eyebrow: 'Regulator view', lead: 'This view exists so a supervisor can examine a company\'s disclosure without being sold to, and without trusting elan1.', actions: c.button('Report a defect', { icon: 'flag', attrs: 'data-action="p-defect"' }) }) +
        c.callout({ kind: 'rule', title: 'No regulator has reviewed or approved elan1.', body: '<p>We do not ask regulators for endorsement, a no-objection letter, a listing, or a waiver. Nothing is claimed to you that a verifier cannot demonstrate.</p>' }) + '<div class="e1p-gap"></div>' +
        c.section({ id: 'received', title: 'Disclosures received', body: discTbl }) +
        '<div class="e1p-grid e1p-grid--2">' +
        c.card({ title: 'The claim, in three sentences', eyebrow: 'Locked text', body: '<ol style="margin:0;padding-left:20px;line-height:1.7"><li>Every governed change of these types went through stated rules, with a named actor and, where required, a named approver.</li><li>Here is a file covering a period the company chose. You can check it on your own machine, offline, with software you did not get from us.</li><li>Here is what that file does not establish, in the profile\'s own words, printed in every report.</li></ol>' }) +
        c.card({ title: 'Everything an agent did, separately from everything a person did', body: '<p class="e1p-note" style="margin:0 0 10px">Actor kind is one of the sixteen fields. It is never inferred, so you can separate software from people without asking the company.</p>' + c.kv([['Person', 'human'], ['Software agent', 'agent'], ['Scheduled system', 'system']].map(function (x) { return [x[0], '<code class="e1-mono">actor_kind = ' + x[1] + '</code>', { html: true }]; }), { compact: true }) }) + '</div>' +
        c.section({ id: 'limits', title: 'The limits, handed over unprompted', body: limitsTable() }) +
        '<div class="e1p-grid e1p-grid--2">' +
        c.card({ title: 'What we ask of you', body: '<ol style="margin:0;padding-left:20px;line-height:1.7"><li>Corrections to how we bound a clause</li><li>The report vocabulary you would use</li><li>A view on the open format</li><li>A contact for defects</li></ol>' }) +
        c.card({ title: 'What we never ask', body: '<ul style="margin:0;padding-left:20px;line-height:1.7"><li>An endorsement</li><li>A no-objection letter</li><li>A listing</li><li>A pilot you must justify</li><li>A waiver</li></ul>' }) + '</div>');
    }
  });
  E1.action('p-defect', function () {
    E1.modal({ title: 'Report a defect', eyebrow: 'Anyone may report · acknowledged within 5 working days', body: '<div class="e1-stack">' +
      c.field('Where', c.select({ id: 'p-dwhere', options: ['A clause binding in a profile', 'The verifier', 'The bundle or receipt format', 'Report wording', 'Something else'] }), { id: 'p-dwhere' }) +
      c.field('What is wrong', c.textarea({ id: 'p-dtext', rows: 4, describedBy: 'p-dtext-msg' }), { id: 'p-dtext', required: true, help: 'At least 12 characters. Recorded as a governed write in elan1\'s operator chain.' }) + '</div>',
      actions: [{ label: 'Cancel', kind: 'ghost' }, { label: 'Send report', kind: 'primary', onClick: function (e, close, root) {
        var t = sel('#p-dtext', root); if (String(t.value || '').trim().length < 12) { showFieldError(t, 'Say what is wrong in at least 12 characters.'); return false; }
        close(); E1.toast('Acknowledgement due within 5 working days. Owner: Arjun Mehta, elan1 lead.', 'good', { title: 'Defect DEF-2028-0004 recorded' });
      } }] });
  });

  E1.route('/regulator/disclosure/:id', {
    title: function (p) { return 'Disclosure ' + p.id; }, layout: 'bare', bareTitle: 'Regulator view', example: '/regulator/disclosure/DS-2028-0003', keywords: 'selective disclosure revealed withheld',
    render: function (p) {
      var lock = portalLock('L3', { who: 'The disclosing company', title: 'Selective disclosure arrives at Level 3 Proven', why: 'A company at Level 1 cannot give you anything you can check without trusting our infrastructure. At Level 2 it can hand you a signed bundle with one redaction profile. Revealing different fields to different readers, each of whom can verify what they were given, is Level 3.', items: ['Revealed and withheld fields, with the justification for each profile', 'A verdict table where withheld, missing and altered never collapse', 'Pre-boundary records clearly marked as not disclosable'], alt: ['Check it without us', '#/regulator/check'] });
      if (lock) return wrap(regBand('disc'), c.pageHeader({ title: 'Disclosure ' + p.id, eyebrow: 'Regulator view · Level 3 Proven' }) + lock);
      var d = discById(p.id);
      if (!d) return wrap(regBand('disc'), c.pageHeader({ title: 'No disclosure ' + p.id, eyebrow: 'Regulator view', back: ['Overview', '#/regulator'] }) + c.empty({ icon: 'eye', title: 'Nothing with that id was disclosed to you.', why: 'Disclosures are listed on the overview exactly as the companies made them. elan1 cannot create one on a company\'s behalf.', action: { label: 'Disclosures received', href: '#/regulator' } }));
      var rev = REG.fields.filter(function (f) { return f.rev; }), wh = REG.fields.filter(function (f) { return !f.rev; });
      var cols = '<div class="e1p-grid e1p-grid--2">' +
        c.card({ title: 'Revealed to you · ' + rev.length + ' of ' + d.total, eyebrow: 'Value disclosed, commitment checks', body: '<ul class="e1p-fields">' + rev.map(function (f) { return '<li><span><code>' + f.f + '</code> <span class="e1p-note">' + esc(f.cls) + '</span></span><span class="e1p-v">' + esc(f.ex) + ' ' + c.badge('good', 'verifies', { subtle: true }) + '</span></li>'; }).join('') + '</ul><p class="e1p-note" style="margin-top:8px">Example values from record #78,412. Every record in range discloses the same fields.</p>' }) +
        c.card({ title: 'Withheld · ' + wh.length + ' of ' + d.total, eyebrow: 'Present as commitments', body: '<ul class="e1p-fields">' + wh.map(function (f) { return '<li><span><code>' + f.f + '</code> <span class="e1p-note">' + esc(f.cls) + '</span></span><span class="e1p-commit">commitment ' + esc(hx('c' + f.f, 6)) + '…</span></li>'; }).join('') + '</ul><p class="e1p-note" style="margin-top:8px">Withheld is not missing, and missing is not altered.</p>' }) + '</div>';
      var always = c.kv([['Always disclosed', 'The sixteen fields of every record — tenant, sequence, previous digest, write type, declaration and policy versions, actor and actor kind, autonomy, record id and version, payload and lexicon digests, recorded_at'], ['Disclosed as a set', 'Gate results — all of them, or none'], ['Never disclosed', 'The record salt, key material, any payload field outside this profile']], { compact: true });
      var verdicts = c.table({ caption: 'Disclosure verdicts', dense: true, columns: [{ key: 's', label: 'Situation' }, { key: 'e', label: 'Exit', html: true }], rows: [
        { s: 'Required field disclosed and verifies', e: '<code class="e1-mono">0 PASS</code>' }, { s: 'Required field not disclosed', e: '<code class="e1-mono">2 FAIL_PROFILE</code> — a scope conversation, not about tampering' },
        { s: 'Disclosed field digest mismatch', e: '<code class="e1-mono">1 FAIL_INTEGRITY</code>, naming record and field' }, { s: 'disclosures.jsonl referenced but absent', e: '<code class="e1-mono">3 INCOMPLETE</code>' },
        { s: 'Salt destroyed by erasure', e: '<code class="e1-mono">0 PASS — payload unbound</code> — never a failure' }, { s: 'Field not required and withheld', e: '<code class="e1-mono">0 PASS</code>' }
      ] });
      var hides = ['Disclosure hides values, not shape: you can see how many records there are and which write types.', 'A low-entropy field is guessable: a withheld yes/no or a small amount can be inferred by trying values.', 'No unlinkability: two disclosures of the same record can be matched to each other.', 'Pre-boundary records are not disclosable: records before seq 71,004 were written before per-field commitments existed.', 'A disclosure is irrevocable: the company cannot take back what it revealed to you.', 'The sixteen fields are always visible, including actor kind and recorded_at.', 'Gate results are revealed as a whole set or not at all.', 'Predicate proofs are not supported: “credit limit satisfied” is shown only if the company committed that outcome as its own field.'];
      return wrap(regBand('disc'),
        previewNote('L3') + (E1.state.level !== 'L1' ? '<div class="e1p-gap"></div>' : '') +
        c.pageHeader({ title: 'Disclosure ' + d.id + ' · ' + d.from, eyebrow: 'Regulator view · ' + lvlName('L3'), back: ['Overview', '#/regulator'], lead: 'You are shown ' + d.revealed + ' of ' + d.total + ' committed fields for records #' + n(d.seqFrom) + '–#' + n(d.seqTo) + '. The company chose this profile; elan1 did not.',
          actions: c.button('Download bundle', { kind: 'primary', icon: 'download', attrs: 'data-action="p-download" data-value="' + d.id.toLowerCase() + '.tar (elan1.evidence.bundle.v2)"' }) + c.button('Report a defect', { icon: 'flag', attrs: 'data-action="p-defect"' }),
          meta: c.level('L3') + '<span class="e1p-fact">' + c.icon('calendar', 14) + '<span>Received ' + esc(fmt.dateTime(d.received)) + ' · disclosed by ' + esc(d.by) + '</span></span><span class="e1p-fact">' + c.icon('file-text', 14) + '<span class="e1-mono">' + esc(d.profile) + ' · ' + esc(d.dprofile) + '</span></span>' }) +
        '<div class="e1p-grid e1p-grid--4">' + c.stat({ label: 'Records', value: n(d.records), note: '#' + n(d.seqFrom) + '–#' + n(d.seqTo) }) + c.stat({ label: 'Refused, in full', value: n(d.refusals), note: 'Refusals are always included' }) + c.stat({ label: 'By software agents', value: n(d.agent), note: 'actor_kind = agent' }) + c.stat({ label: 'By people', value: n(d.person), note: 'actor_kind = human · ' + n(d.system) + ' by scheduled systems' }) + '</div>' + '<div class="e1p-gap"></div>' +
        c.section({ id: 'fields', title: 'What is revealed, and what is withheld', lead: 'Justification recorded by the company for this profile: “A supervisor examining the audit trail needs the document number, date and amounts to trace entries to the books; counterparty and personal fields are not needed for that purpose.”', body: cols + '<div class="e1p-gap"></div><div class="e1p-panel">' + always + '</div><div class="e1p-gap"></div>' }) +
        '<div class="e1p-main-side"><div>' +
        c.section({ id: 'verify', title: 'Verify it without us', body: '<ol class="e1p-steps"><li><div><h3>Obtain a verifier that reads bundle v2</h3><p>This bundle carries a ninth member, disclosures.jsonl. A verifier that only reads v1 exits 4 UNSUPPORTED — correctly.</p>' + c.button('Verifier releases', { size: 'sm', href: '#/verify/releases' }) + '</div></li><li><div><h3>Get the company\'s key fingerprint through a channel other than the bundle</h3><p>The company sends it separately — a signed letter or your own supervisory channel. Never from this page alone.</p></div></li><li><div><h3>Run it air-gapped</h3>' + c.code('elan1-verify --bundle ' + d.id.toLowerCase() + '.tar \\\n  --profile in-mca-audit-trail-v1.json \\\n  --key-fingerprint <from the company, out of band>', 'shell', { title: 'Terminal · offline' }) + '</div></li><li><div><h3>Read the verdict against this table</h3>' + verdicts + '</div></li></ol>' }) +
        '</div><div class="e1-stack">' +
        c.card({ title: 'What disclosure does not hide', body: '<ul style="margin:0;padding-left:18px;line-height:1.55;color:var(--text-primary)">' + hides.map(function (h) { return '<li style="margin-bottom:6px">' + esc(h) + '</li>'; }).join('') + '</ul>' }) +
        c.card({ title: 'Limits line', body: '<blockquote class="e1p-quote">' + esc(LIMITS_MCA) + '<cite>in-mca-audit-trail v1 · verbatim</cite></blockquote>' }) +
        c.card({ title: 'This disclosure in the log', body: c.timeline([
          { time: fmt.dateTime(d.received), title: 'Disclosed by the company', body: 'Recorded in the company\'s chain; the fields revealed are listed there too, because a disclosure cannot be taken back.', state: 'neutral' },
          { time: '15 Mar 2028, 11:00 IST', title: 'Technical questions answered by elan1', body: 'Mapped to the reviewer dossier §3. Nothing promised beyond it.', state: 'neutral', href: '#/regulator/log' }
        ]) }) + '</div></div>');
    }
  });

  E1.route('/regulator/check', {
    title: 'Check it without us', layout: 'bare', bareTitle: 'Regulator view', keywords: 'self-check reviewer routes air-gapped',
    render: function () {
      var steps = [
        ['Obtain the verifier and check SHA256SUMS', 'From the release page and from the independent registry. Compare digests.', '#/verify/releases', 'Releases'],
        ['Rebuild it from source', 'Pinned toolchain; byte-identical output. If yours differs, tell us — and do not run ours.', '#/verify/releases/1.0.3', 'Build instructions'],
        ['Read the source', 'Standard library only, small enough to read in a day.', '#/verify/releases/1.0.3', 'Source tarball'],
        ['Run it air-gapped', 'No network, no account, no code of ours running anywhere else.', '#/verify', 'The command'],
        ['Run it on the tampered bundle and watch 1 FAIL_INTEGRITY', 'A verifier nobody has watched refuse is not a verifier.', '#/verify/tampered', 'Tampered bundle'],
        ['Write your own verifier from the specification', 'The strongest thing you can do with this is not use our software.', '#/standard', 'The specification']
      ];
      return wrap(regBand('check'), c.pageHeader({ title: 'Check it without us', eyebrow: 'Regulator view · six self-checks', lead: 'Six things a reviewer can do alone. Each step reduces how much you need to trust elan1; the last removes it.' }) +
        '<ol class="e1p-steps">' + steps.map(function (s) { return '<li><div><h3>' + esc(s[0]) + '</h3><p>' + esc(s[1]) + '</p>' + c.button(s[3], { size: 'sm', href: s[2], iconRight: 'arrow-right' }) + '</div></li>'; }).join('') + '</ol>' +
        '<div class="e1p-gap"></div>' + c.section({ id: 'limits', title: 'The limits, again', lead: 'The same table on every surface, so the story cannot drift.', body: limitsTable() }));
    }
  });

  E1.route('/regulator/log', {
    title: 'Engagement log', layout: 'bare', bareTitle: 'Regulator view', keywords: 'regulator engagement log governed write operator chain',
    render: function () {
      var rows = [
        { at: '2028-03-15T11:00:00+05:30', aud: 'Examination team (sample)', route: 'Customer examination — company-led', who: 'Founder; Arjun Mehta (elan1 lead)', asked: 'How the regulator-statutory profile was chosen; what withheld fields mean for the verdict', said: 'Reviewer dossier §3 and §5; the disclosure verdict table', promised: 'Nothing beyond the dossier', seq: 2214 },
        { at: '2028-02-05T15:30:00+05:30', aud: 'Examination team (sample)', route: 'Customer examination — company-led', who: 'Founder', asked: 'Whether elan1 can see payload fields it withheld from you', said: 'Dossier §4: at L3 with customer-held keys, per deployment; not in this deployment', promised: 'A written note on salt custody by 19 Feb 2028', seq: 2168 },
        { at: '2028-01-22T10:00:00+05:30', aud: 'CA institute working session (sample)', route: 'Industry body', who: 'Founder; Arjun Mehta', asked: 'Corrections to the MCA clause reading', said: 'Dossier §2; the binding table', promised: 'Publish corrections as a new profile version, never an edit', seq: 2131 }
      ];
      return wrap(regBand('log'), c.pageHeader({ title: 'Engagement log', eyebrow: 'Regulator view', lead: 'Every interaction with a supervisor or reviewer is recorded as a governed write in elan1\'s own operator chain: who, when, what was asked, what we said, and what we promised.' }) +
        c.table({ caption: 'Engagement log', columns: [
          { key: 'at', label: 'When', nowrap: true, render: function (r) { return esc(fmt.dateTime(r.at)); } },
          { key: 'aud', label: 'Audience and route', render: function (r) { return esc(r.aud) + '<div class="e1p-note">' + esc(r.route) + '</div>'; } },
          { key: 'who', label: 'elan1 attendees' }, { key: 'asked', label: 'What was asked' }, { key: 'said', label: 'What we said' }, { key: 'promised', label: 'What we promised' },
          { key: 'seq', label: 'Record', render: function (r) { return '<span class="e1-mono">operator #' + n(r.seq) + '</span>'; } }
        ], rows: rows }) + '<p class="e1p-note" style="margin-top:12px">Only the founder speaks for elan1, with the elan1 lead for technical detail. Sales, partners and integrators never attend. Nothing is said that is not in the reviewer dossier.</p>');
    }
  });

  /* ==========================================================================
     COUNTERPARTY PORTAL  (/counterparty…) — receipts received, verify, bind, dispute
     ========================================================================== */
  var CP = D.counterparty = {
    org: 'ACME Textiles LLP, Surat', orgId: 'ar-org:acmetextiles.example', mark: 'AT', person: 'Nisha Patel', role: 'Accounts payable lead',
    people: [{ name: 'Nisha Patel', role: 'Accounts payable lead' }, { name: 'Arvind Shah', role: 'Finance controller' }, { name: 'Meera Desai', role: 'CFO' }],
    receipts: [
      { id: 'RC-78412', issuer: 'Kaveri Spinning Mills Pvt Ltd', iorg: 'ar-org:kaverispinning.example', seq: 78412, wt: 'erp.sales_invoice.submit', obj: 'SINV-2028-00412', amount: 2764300, received: '2028-03-18T11:20:00+05:30', expires: '2028-03-25T11:20:00+05:30', v: 'PASS', route: 'pinned', rev: 3, anchored: true, bound: 8902 },
      { id: 'RC-78455', issuer: 'Kaveri Spinning Mills Pvt Ltd', iorg: 'ar-org:kaverispinning.example', seq: 78455, wt: 'erp.sales_invoice.submit', obj: 'SINV-2028-00455', amount: 486200, received: '2028-03-19T09:05:00+05:30', expires: '2028-03-26T09:05:00+05:30', v: 'PASS', route: 'pinned', rev: 3, anchored: false, waiting: 'Arvind Shah' },
      { id: 'RC-78460', issuer: 'Kaveri Spinning Mills Pvt Ltd', iorg: 'ar-org:kaverispinning.example', seq: 78460, wt: 'erp.credit_note.submit', obj: 'CN-2028-00091', amount: 48300, received: '2028-03-19T10:40:00+05:30', expires: '2028-03-26T10:40:00+05:30', v: 'PASS', route: 'pinned', rev: 3, anchored: true },
      { id: 'RC-3120', issuer: 'Surya Auto Parts Pvt Ltd', iorg: 'ar-org:suryaauto.example', seq: 3120, wt: 'erp.payment_entry.submit', obj: 'PE-2028-00331', amount: 112500, received: '2028-03-17T16:02:00+05:30', expires: '2028-03-24T16:02:00+05:30', v: 'PASS', route: 'keydoc', rev: 2, anchored: true, bound: 8877 },
      { id: 'RC-78412-2', issuer: 'Kaveri Spinning Mills Pvt Ltd', iorg: 'ar-org:kaverispinning.example', seq: 78412, wt: 'erp.sales_invoice.submit', obj: 'SINV-2028-00412 (received again)', amount: 2764300, received: '2028-03-19T12:30:00+05:30', expires: '2028-03-25T11:20:00+05:30', v: 'REPLAYED', code: 'GATE.RECEIPT_REPLAYED', route: 'pinned', rev: 3, anchored: true },
      { id: 'RC-78391', issuer: 'Kaveri Spinning Mills Pvt Ltd', iorg: 'ar-org:kaverispinning.example', seq: 78391, wt: 'erp.sales_invoice.submit', obj: 'SINV-2028-00391', amount: 1318000, received: '2028-03-05T10:00:00+05:30', expires: '2028-03-12T10:00:00+05:30', v: 'EXPIRED', code: 'POLICY.RECEIPT_EXPIRED', route: 'pinned', rev: 3, anchored: true },
      { id: 'RC-51877', issuer: 'Kaveri Spinning Mills Pvt Ltd', iorg: 'ar-org:kaverispinning.example', seq: 51877, wt: 'erp.sales_invoice.submit', obj: 'addressed to ar-org:acmetex.example', amount: null, received: '2028-03-16T14:12:00+05:30', expires: '2028-03-23T14:12:00+05:30', v: 'AUDIENCE_MISMATCH', code: 'POLICY.RECEIPT_AUDIENCE_MISMATCH', route: 'pinned', rev: 0, anchored: true },
      { id: 'RC-0917', issuer: 'Deccan Freight Carriers', iorg: 'ar-org:deccanfreight.example', seq: 917, wt: 'freight.invoice.submit', obj: 'DFC/2028/0917', amount: 64200, received: '2028-03-18T08:44:00+05:30', expires: '2028-03-25T08:44:00+05:30', v: 'TRUST_ANCHOR_UNKNOWN', code: 'POLICY.TRUST_ANCHOR_UNKNOWN', route: 'none', rev: 2, anchored: true },
      { id: 'RC-78299', issuer: 'Kaveri Spinning Mills Pvt Ltd', iorg: 'ar-org:kaverispinning.example', seq: 78299, wt: 'erp.sales_invoice.submit', obj: 'SINV-2028-00299', amount: 912400, received: '2028-03-12T15:18:00+05:30', expires: '2028-03-19T15:18:00+05:30', v: 'FAIL_INTEGRITY', code: 'POLICY.RECEIPT_UNVERIFIED', route: 'pinned', rev: 3, anchored: true, dispute: 'DSP-2028-003' }
    ]
  };
  var VERDICT_UI = {
    PASS: ['good', 'PASS', 'Verified. Bind it if you will act on it.'],
    REPLAYED: ['info', 'REPLAYED — reported', 'Treat as the same event, not a second one. Already bound at record 8,902.'],
    EXPIRED: ['neutral', 'EXPIRED', 'Procedural, not forensic. Ask for a fresh receipt.'],
    AUDIENCE_MISMATCH: ['neutral', 'AUDIENCE_MISMATCH', 'Addressed to another organisation. Return it. Do not act on it.'],
    TRUST_ANCHOR_UNKNOWN: ['warning', 'TRUST_ANCHOR_UNKNOWN', 'No discovery route resolved. Establish the relationship out of band first.'],
    FAIL_INTEGRITY: ['critical', 'FAIL_INTEGRITY', 'Stop. This is forensic, not commercial. Do not negotiate it over email.']
  };
  function rcById(id) { for (var i = 0; i < CP.receipts.length; i++) if (CP.receipts[i].id === id) return CP.receipts[i]; return null; }
  function binding(r) {
    var s = E1.store.get('p.bind.' + r.id, null);
    if (r.bound) return { st: 'bound', seq: r.bound };
    if (s) return s;
    if (r.waiting) return { st: 'waiting', who: r.waiting };
    return { st: r.v === 'PASS' ? 'none' : 'refused' };
  }
  function bindBadge(r) {
    var b = binding(r);
    if (b.st === 'bound') return c.badge('good', 'Bound at record ' + n(b.seq), { subtle: true });
    if (b.st === 'waiting') return c.badge('warning', 'Waiting on ' + b.who, { subtle: true });
    if (b.st === 'none') return c.badge('neutral', 'Not bound', { subtle: true });
    return '<span class="e1-mono e1p-note">' + esc(r.code || '—') + '</span>';
  }
  function cpBand(active, states) {
    var open = CP.receipts.filter(function (r) { return binding(r).st === 'none' || binding(r).st === 'waiting'; }).length;
    return band({
      portal: 'Counterparty portal', mark: CP.mark, viewer: [CP.person, CP.role], eyebrow: 'Counterparty portal · signed in', org: CP.org, sub: 'Signed in as ' + CP.person + ' · ' + CP.role + ' · ' + CP.orgId,
      facts: [
        { icon: 'key', html: 'Counterparty verification seat — your receiving console: register, binding, dispute log. <strong>The verifier itself is free, to anyone.</strong>' },
        { icon: 'scale', html: 'elan1 does not adjudicate between organisations' },
        { icon: 'lock', html: 'No callback to the issuer, ever' }
      ],
      tools: levelMenu('Issuers at') + statesMenu(states) + sandboxTag(),
      tabs: [
        { id: 'inbox', label: 'Receipts received', href: '#/counterparty', icon: E1.atLeast('L3') ? 'mail' : 'lock', count: E1.atLeast('L3') ? open : undefined },
        { id: 'disputes', label: 'Disputes', href: '#/counterparty/disputes', icon: 'flag' },
        { id: 'register', label: 'Issuers you accept', href: '#/counterparty/register', icon: 'fingerprint' },
        { id: 'verify', label: 'Public verifier', href: '#/verify', icon: 'terminal' }
      ], active: active
    });
  }
  function cpLock(title) {
    return portalLock('L3', { who: 'Organisations that send you receipts', title: title || 'Action Receipts arrive at Level 3 Proven', why: 'A receipt lets you check one of a supplier\'s writes without trusting their vendor or yours. It needs cross-organisation verification — a key you pinned, an envelope addressed to you, an expiry — which is Level 3. Today a supplier can only tell you what their system did.', items: ['An inbox of receipts, each verified in 13 steps before you see it', 'Bind a receipt into your own chain, approved by two of your people', 'A dispute log in which elan1 never takes a side'], today: 'You can already read how verification works and download the verifier.', alt: ['Public verifier', '#/verify'] });
  }
  E1.route('/counterparty', {
    title: 'Receipts received', layout: 'bare', bareTitle: 'Counterparty portal', keywords: 'counterparty action receipt inbox verify accept bind',
    render: function (p, q) {
      var states = [{ label: 'Inbox', href: '#/counterparty' }, { label: 'Needs your action', href: '#/counterparty?filter=action' }, { label: 'Problems only', href: '#/counterparty?filter=problems' }, { label: 'Empty inbox', href: '#/counterparty?state=empty' }, { label: 'Cannot load (our failure)', href: '#/counterparty?state=error' }];
      var lock = cpLock();
      if (lock) return wrap(cpBand('inbox', states), c.pageHeader({ title: 'Receipts received', eyebrow: 'Counterparty portal · Level 3 Proven' }) + lock);
      if (q.state === 'error') return wrap(cpBand('inbox', states), c.pageHeader({ title: 'Receipts received', eyebrow: 'Counterparty portal' }) + c.error({ title: 'We cannot show your receipts right now.', body: 'Your receipt store did not answer. This is our failure.', reassurance: 'Nothing was bound, accepted or discarded in the meantime. Receipts are files — the ones in your mailbox still verify with the offline verifier.', code: 'PLATFORM.REGISTRY_UNAVAILABLE', action: [{ label: 'Try again', href: '#/counterparty' }, { label: 'Verify offline', href: '#/verify', kind: 'ghost' }] }));
      var all = q.state === 'empty' ? [] : CP.receipts;
      var f = q.filter || 'all', qq = String(q.q || '').toLowerCase();
      var rows = all.filter(function (r) {
        var b = binding(r).st;
        if (f === 'action' && !(b === 'none' || b === 'waiting')) return false;
        if (f === 'problems' && r.v === 'PASS') return false;
        if (qq && (r.id + ' ' + r.issuer + ' ' + r.obj + ' ' + r.wt).toLowerCase().indexOf(qq) < 0) return false;
        return true;
      });
      var cnt = function (fn) { return all.filter(fn).length; };
      var filters = c.filters([
        { label: 'All', href: E1.href('/counterparty', { q: q.q }), active: f === 'all', count: all.length },
        { label: 'Needs your action', href: E1.href('/counterparty', { filter: 'action', q: q.q }), active: f === 'action', count: cnt(function (r) { var b = binding(r).st; return b === 'none' || b === 'waiting'; }) },
        { label: 'Did not verify or procedural', href: E1.href('/counterparty', { filter: 'problems', q: q.q }), active: f === 'problems', count: cnt(function (r) { return r.v !== 'PASS'; }) }
      ], { label: 'Show' });
      var tbl = c.table({
        caption: 'Receipts received', rowHref: function (r) { return '#/counterparty/receipt/' + r.id; },
        columns: [
          { key: 'id', label: 'Receipt', mono: true, render: function (r) { return esc(r.id) + '<div class="e1p-note">issuer record #' + n(r.seq) + '</div>'; } },
          { key: 'issuer', label: 'Issuer', render: function (r) { return esc(r.issuer) + '<div class="e1p-note e1-mono">' + esc(r.iorg) + '</div>'; } },
          { key: 'wt', label: 'What they did', render: function (r) { return '<span class="e1-mono">' + esc(r.wt) + '</span><div class="e1p-note">' + esc(r.obj) + (r.amount ? ' · ' + fmt.inr(r.amount) : '') + '</div>'; } },
          { key: 'v', label: 'Verification', render: function (r) { var u = VERDICT_UI[r.v]; return c.badge(u[0], u[1]) + (r.v === 'PASS' && !r.anchored ? '<div style="margin-top:4px">' + c.badge('info', 'UNANCHORED — reported', { subtle: true }) + '</div>' : ''); } },
          { key: 'b', label: 'In our chain', render: function (r) { return bindBadge(r); } },
          { key: 'received', label: 'Received', nowrap: true, render: function (r) { return esc(fmt.dateTime(r.received)); } }
        ],
        rows: rows,
        empty: all.length ? { title: 'No receipt matches this view.', why: 'Try another filter, or clear the search.', action: { label: 'Show all', href: '#/counterparty' } } : { icon: 'mail', title: 'No receipts have been sent to ACME Textiles yet.', why: 'A receipt arrives as a file, usually attached to an invoice or remittance e-mail. We do not deliver receipts; the issuer does.', fill: 'Drop a receipt file here, or ask a supplier to address one to ' + CP.orgId + '.', action: { label: 'Issuers you accept', href: '#/counterparty/register' } }
      });
      return wrap(cpBand('inbox', states),
        previewNote('L3') + (E1.state.level !== 'L1' ? '<div class="e1p-gap"></div>' : '') +
        c.pageHeader({ title: 'Receipts received', eyebrow: 'Counterparty portal · ' + lvlName('L3'), lead: 'Every receipt was verified in 13 steps before it reached this list. A receipt verifies or it does not — there is no partial state.',
          actions: c.button('Add a receipt file', { kind: 'primary', icon: 'upload', attrs: 'data-action="p-rc-add"' }) }) +
        c.toolbar(filters, c.searchBox({ id: 'p-inbox-q', placeholder: 'Search receipts', value: q.q, kbd: '/', attrs: 'data-p-inbox-search' })) + tbl);
    },
    mount: function (el, p, q) {
      var s = sel('[data-p-inbox-search]', el);
      if (s) s.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); E1.go('/counterparty', { filter: q.filter, q: s.value || undefined }); } });
    }
  });
  E1.action('p-rc-add', function () {
    E1.modal({ title: 'Add a receipt file', eyebrow: 'Verified in your browser session, then listed', body: '<div class="e1-stack"><p class="e1p-note">The page echoes the claim first, then checks the audience, expiry and the issuer\'s key through the route you pinned. The only network step — fetching an issuer\'s key document — is shown when it happens.</p>' +
      '<label class="e1p-drop"><span class="e1p-rows__icon">' + c.icon('upload', 16) + '</span><span class="e1p-rows__main"><span class="e1p-rows__t">Choose receipt-*.json</span><span class="e1p-rows__d" style="display:block">action-receipt/1</span></span><input type="file" accept=".json"><span class="e1-btn e1-btn--secondary e1-btn--sm" aria-hidden="true"><span>Choose</span></span></label></div>',
      actions: [{ label: 'Cancel', kind: 'ghost' }, { label: 'Use the sample receipt', kind: 'primary', onClick: function (e, close) { close(); E1.go('/counterparty/receipt/RC-78460'); E1.toast('Claim echoed, 13 steps run: PASS. Not yet bound into your chain.', 'good', { title: 'RC-78460 verified' }); } }] });
  });

  var STEPS13 = [
    ['Format and suite supported', 'action-receipt/1 · elan1-seal-v6', 'UNSUPPORTED'],
    ['Audience is you', 'audience = ar-org:acmetextiles.example', 'AUDIENCE_MISMATCH'],
    ['Not expired', 'expires_at in the future', 'EXPIRED'],
    ['Issuer key resolved by a discovery route', 'pinned fingerprint or key document — never the in-receipt hint', 'TRUST_ANCHOR_UNKNOWN'],
    ['Key window covers recorded_at', 'valid_from ≤ recorded_at < valid_to', 'FAIL_INTEGRITY'],
    ['Preimage recomputed', 'sixteen fields, length-prefixed, domain string', 'FAIL_INTEGRITY'],
    ['Digest recomputed', 'SHA-256', 'FAIL_INTEGRITY'],
    ['Record signature', 'Ed25519 over the digest (RFC 8032)', 'FAIL_INTEGRITY'],
    ['Envelope signature', 'over digest ‖ audience ‖ nonce ‖ expires_at', 'FAIL_INTEGRITY'],
    ['Merkle inclusion path', 'RFC 6962 path to the batch root', 'FAIL_INTEGRITY'],
    ['Anchor token', 'RFC 3161 over the root — reported, not failed, if absent', 'UNANCHORED'],
    ['Disclosed values match their commitments', 'each revealed field against F14', 'FAIL_INTEGRITY'],
    ['Replay check', 'against receipts already bound in your chain', 'REPLAYED']
  ];
  function stepResults(r) {
    var stopAt = { AUDIENCE_MISMATCH: 1, EXPIRED: 2, TRUST_ANCHOR_UNKNOWN: 3 }[r.v];
    return STEPS13.map(function (s, i) {
      if (stopAt !== undefined) return i < stopAt ? 'passed' : i === stopAt ? 'failed' : 'notrun';
      if (r.v === 'FAIL_INTEGRITY') return i === 11 ? 'failed' : 'passed';
      if (i === 10 && !r.anchored) return 'reported';
      if (i === 12 && r.v === 'REPLAYED') return 'reported';
      return 'passed';
    });
  }
  E1.route('/counterparty/receipt/:id', {
    title: function (p) { return 'Receipt ' + p.id; }, layout: 'bare', bareTitle: 'Counterparty portal', example: '/counterparty/receipt/RC-78412', keywords: 'receipt verify accept dispute bind',
    render: function (p) {
      var lock = cpLock('Verifying a receipt arrives at Level 3 Proven');
      if (lock) return wrap(cpBand('inbox'), c.pageHeader({ title: 'Receipt ' + p.id, eyebrow: 'Counterparty portal · Level 3 Proven' }) + lock);
      var r = rcById(p.id);
      if (!r) return wrap(cpBand('inbox'), c.pageHeader({ title: 'No receipt ' + p.id, eyebrow: 'Counterparty portal', back: ['Receipts received', '#/counterparty'] }) + c.empty({ icon: 'mail', title: 'No receipt with that id has reached ACME Textiles.', why: 'Receipts are files the issuer sends you. If a supplier says they sent one, ask for the file itself — we cannot fetch it for you.', action: { label: 'Receipts received', href: '#/counterparty' } }));
      var u = VERDICT_UI[r.v], b = binding(r), res13 = stepResults(r);
      var stepsTbl = c.table({ caption: 'The 13 verification steps', dense: true, columns: [{ key: 'n', label: '#', mono: true, width: '40px' }, { key: 't', label: 'Step' }, { key: 'd', label: 'Checks' }, { key: 'r', label: 'Result', html: true, nowrap: true }], rows: STEPS13.map(function (s, i) {
        var x = res13[i];
        return { n: i + 1, t: s[0], d: s[1], r: x === 'passed' ? res('passed') : x === 'failed' ? (s[2] === 'FAIL_INTEGRITY' ? res('failed', 'FAIL_INTEGRITY') : c.badge(VERDICT_UI[s[2]] ? VERDICT_UI[s[2]][0] : 'neutral', s[2], { subtle: true })) : x === 'reported' ? res('reported', s[2] + ' — reported') : res('notrun', 'not run') };
      }) });
      var routeLine = r.route === 'pinned' ? 'Accepted on a pinned fingerprint since March 2028' : r.route === 'keydoc' ? 'Accepted on a key document fetched four minutes ago' : 'No discovery route resolved — ' + r.iorg + ' is not in your register';
      var discl = r.v === 'AUDIENCE_MISMATCH' ? '<p class="e1p-note">Not opened. A receipt addressed to someone else is returned, not read.</p>' :
        '<ul class="e1p-fields">' + [{ f: 'invoice_no', v: r.obj.split(' ')[0] }, { f: 'grand_total', v: r.amount ? fmt.inr(r.amount) : '—' }, { f: 'party_gstin', v: '24AAHFA3319K1Z9' }].slice(0, r.rev).map(function (x, i) { var bad = r.v === 'FAIL_INTEGRITY' && x.f === 'grand_total'; return '<li><code>' + x.f + '</code><span class="e1p-v">' + esc(bad ? '₹9,21,400' : x.v) + ' ' + (bad ? c.badge('critical', 'does not match commitment') : c.badge('good', 'matches commitment', { subtle: true })) + '</span></li>'; }).join('') +
        '<li><span class="e1p-note">' + (11 - r.rev) + ' further fields withheld as commitments</span><span class="e1p-commit">not disclosed to you</span></li></ul>';
      var fields16 = c.table({ caption: 'The sixteen fields (always shown)', dense: true, columns: [{ key: 'k', label: 'Field', mono: true }, { key: 'v', label: 'Value', mono: true }], rows: [
        ['tenant_id', hx('t' + r.iorg, 8) + '-…'], ['seq', n(r.seq)], ['prev_digest', E1.fmt.shortHash(hx('p' + r.id, 64))], ['write_id', 'wr_' + hx('w' + r.id, 10)], ['write_type', r.wt], ['declaration_id · version', hx('d' + r.iorg, 8) + '-… · 11'], ['policy_version', '16'], ['actor_id · actor_kind', hx('a' + r.id, 8) + '-… · agent'],
        ['autonomy_level', 'A2'], ['record_id · record_version', hx('r' + r.id, 8) + '-… · 1'], ['payload_hash', E1.fmt.shortHash(hx('ph' + r.id, 64))], ['lexicon_hash', E1.fmt.shortHash(hx('lx', 64))], ['recorded_at', new Date(new Date(r.received).getTime() - 3600000).toISOString().replace('.000', '')]
      ].map(function (x) { return { k: x[0], v: x[1] }; }) });
      var actions = '';
      if (r.v === 'PASS' && b.st === 'none') actions = c.button('Bind into our chain', { kind: 'gate', attrs: 'data-action="p-bind" data-value="' + r.id + '"' });
      if (r.v === 'FAIL_INTEGRITY') actions = c.button('Preserve the exact bytes', { icon: 'download', attrs: 'data-action="p-export" data-value="' + r.id + '.json — exact bytes as received"' }) + c.button(r.dispute ? 'Open dispute ' + r.dispute : 'Open a dispute', { kind: 'primary', icon: 'flag', href: r.dispute ? '#/counterparty/disputes/' + r.dispute : '#/counterparty/disputes?new=' + r.id });
      if (r.v === 'EXPIRED') actions = c.button('Copy a request for a fresh receipt', { icon: 'copy', attrs: 'data-copy="Please reissue receipt ' + r.id + ' (issuer record ' + r.seq + ') addressed to ' + CP.orgId + '. The receipt we hold expired on ' + fmt.date(r.expires) + '." data-copy-label="Request text"' });
      if (r.v === 'AUDIENCE_MISMATCH') actions = c.button('Copy a return note', { icon: 'copy', attrs: 'data-copy="Receipt ' + r.id + ' was addressed to another organisation. We have not acted on it and are returning it." data-copy-label="Return note"' });
      if (r.v === 'TRUST_ANCHOR_UNKNOWN') actions = c.button('Register this issuer', { kind: 'primary', icon: 'fingerprint', href: '#/counterparty/register?add=' + encodeURIComponent(r.iorg) });
      if (r.v === 'PASS' || r.v === 'REPLAYED') actions += c.button('Open a dispute', { kind: 'ghost', icon: 'flag', href: '#/counterparty/disputes?new=' + r.id });
      var bindCard = b.st === 'bound' ? c.callout({ kind: 'good', title: 'Receipt accepted — bound at record ' + n(b.seq) + ' to issuer record ' + n(r.seq) + '.', body: '<p>Approved by Nisha Patel and Arvind Shah (cross_boundary forces two approvers). There is no callback to the issuer.</p>' })
        : b.st === 'waiting' ? c.callout({ kind: 'warning', title: 'Waiting on ' + b.who + ' to decide the binding.', body: '<p>You proposed it; a second named person must decide it. Nothing is bound until then.</p>' })
        : r.v === 'PASS' ? c.callout({ kind: 'info', title: 'Verified, not yet in your chain.', body: '<p>Binding records <code>receipt.accept</code> in ACME\'s chain — crosses an organisation boundary, so two of your people approve it.</p>' }) : '';
      return wrap(cpBand('inbox'),
        previewNote('L3') + (E1.state.level !== 'L1' ? '<div class="e1p-gap"></div>' : '') +
        c.pageHeader({ title: 'Receipt ' + r.id, eyebrow: 'Counterparty portal · from ' + r.issuer, back: ['Receipts received', '#/counterparty'], lead: r.wt + ' · ' + r.obj + (r.amount ? ' · ' + fmt.inr(r.amount) : ''), actions: actions + c.button('Ask issuer for a reversal receipt', { kind: 'ghost', icon: 'copy', attrs: 'data-copy="If you reverse record ' + r.seq + ', please send us the reversal receipt addressed to ' + CP.orgId + '." data-copy-label="Request text"' }),
          meta: c.level('L3') + '<span class="e1p-fact">' + c.icon('fingerprint', 14) + '<span>' + esc(routeLine) + '</span></span><span class="e1p-fact">' + c.icon('timer', 14) + '<span>Expires ' + esc(fmt.dateTime(r.expires)) + '</span></span>' }) +
        '<section class="e1p-verdict e1p-verdict--' + u[0] + '" aria-label="Verdict"><div class="e1p-verdict__code" style="font-size:18px;min-width:auto">' + c.icon(u[0] === 'good' ? 'check' : u[0] === 'critical' ? 'x' : 'info', 28) + '</div><div><div class="e1p-verdict__line"><span>' + esc(u[1]) + '</span>' + (r.code ? '<code class="e1-mono e1p-note">' + esc(r.code) + '</code>' : '') + (r.v === 'PASS' && !r.anchored ? c.badge('info', 'UNANCHORED — reported, not failed', { subtle: true }) : '') + '</div><p class="e1p-verdict__means">' + esc(u[2]) + '</p><p class="e1p-verdict__next">' + esc(RECEIPT_LIMITS) + '</p></div></section>' +
        '<div class="e1p-gap"></div>' + bindCard + (bindCard ? '<div class="e1p-gap"></div>' : '') +
        '<div class="e1p-main-side"><div>' +
        c.section({ id: 'claim', title: 'The claim, echoed first', body: c.kv([['Issuer', r.issuer + ' · ' + r.iorg], ['Audience', r.v === 'AUDIENCE_MISMATCH' ? 'ar-org:acmetex.example (not you)' : CP.orgId, { mono: true }], ['Source record', 'issuer #' + n(r.seq) + ' · ' + r.wt, { mono: true }], ['Disclosed', r.rev + ' of 11 committed fields'], ['Anchored', r.anchored ? 'yes — RFC 3161, two authorities' : 'not yet — unanchored at issue'], ['Key', 'kav-2028q1-01 · window 2028-01-01 →', { mono: true }], ['Nonce', hx('n' + r.id, 32), { mono: true }]], { compact: true, cols: 2 }) }) +
        c.section({ id: 'steps', title: 'Thirteen steps, in order', lead: 'The normative order. Verification stops at the first procedural failure; integrity failures name the field.', body: stepsTbl }) +
        c.section({ id: 'fields', title: 'The sixteen fields', body: fields16 }) +
        '</div><div class="e1-stack">' +
        c.card({ title: 'Disclosed to you', body: discl }) +
        c.card({ title: 'Limits', body: '<blockquote class="e1p-quote">' + esc(RECEIPT_LIMITS) + '<cite>limits member · verbatim</cite></blockquote>' }) +
        (r.v === 'FAIL_INTEGRITY' ? c.callout({ kind: 'critical', title: 'Forensic, not commercial.', body: '<p>The disclosed grand_total does not match the commitment in the signed record. Somebody\'s copy was altered after issue. Keep the exact bytes and open a dispute; do not settle it by e-mail.</p>' }) : '') +
        '</div></div>');
    }
  });
  E1.action('p-bind', function (el) {
    var id = el.getAttribute('data-value');
    E1.modal({ title: 'Bind ' + id + ' into ACME\'s chain', eyebrow: 'receipt.accept · crosses an organisation boundary · two approvers', body: '<div class="e1-stack">' +
      c.kv([['Proposer', 'Nisha Patel (you)'], ['Blast radius', 'Crosses an organisation boundary'], ['Verifier result', 'PASS — a gate input, not the decision']], { compact: true }) +
      c.field('Second approver', c.select({ id: 'p-appr', options: [{ value: '', label: 'Choose a person' }, { value: 'Arvind Shah', label: 'Arvind Shah · Finance controller' }, { value: 'Meera Desai', label: 'Meera Desai · CFO' }, { value: 'Nisha Patel', label: 'Nisha Patel · you' }] }), { id: 'p-appr', required: true, help: 'A person, never an agent — and never the proposer.' }) + '</div>',
      actions: [{ label: 'Cancel', kind: 'ghost' }, { label: 'Send for approval', kind: 'gate', onClick: function (e, close, root) {
        var v = sel('#p-appr', root).value;
        if (!v) { showFieldError(sel('#p-appr', root), 'Choose who decides this binding.'); return false; }
        if (v === 'Nisha Patel') { showFieldError(sel('#p-appr', root), 'GATE.DUAL_CONTROL_SAME_ACTOR — you proposed this binding, so you cannot approve it. Send it to Arvind Shah or Meera Desai.'); return false; }
        E1.store.set('p.bind.' + id, { st: 'waiting', who: v }); close(); E1.render({ keepScroll: true }); E1.toast('Nothing is bound until ' + v + ' decides.', 'warning', { title: 'Sent to ' + v });
      } }] });
  });

  var DISPUTES = [
    { id: 'DSP-2028-003', rc: 'RC-78299', issuer: 'Kaveri Spinning Mills Pvt Ltd', cls: 'Digest mismatch', kind: 'forensic', opened: '2028-03-12T16:05:00+05:30', status: 'open', ours: 'exit 1 · FAIL_INTEGRITY · disclosures: grand_total', theirs: 'exit 1 · FAIL_INTEGRITY · same field', next: 'Issuer asked for a bundle covering #78,290–#78,310 to compare their signed record with the file we hold.', bytes: dig('91c0', '2d7e') },
    { id: 'DSP-2028-001', rc: 'RC-77810', issuer: 'Kaveri Spinning Mills Pvt Ltd', cls: 'Audience or expiry', kind: 'procedural', opened: '2028-02-27T10:30:00+05:30', status: 'resolved', ours: 'EXPIRED', theirs: 'not run — procedural', next: 'Reissued as RC-77902 on 27 Feb 2028; bound at record 8,611.', bytes: dig('3a55', 'e090') }
  ];
  function disputes() { return (E1.store.get('p.disputes', []) || []).concat(DISPUTES); }
  E1.route('/counterparty/disputes', {
    title: 'Disputes', layout: 'bare', bareTitle: 'Counterparty portal', keywords: 'dispute receipt forensic procedural',
    render: function (p, q) {
      var states = [{ label: 'With disputes', href: '#/counterparty/disputes' }, { label: 'No disputes', href: '#/counterparty/disputes?state=empty' }];
      var rows = q.state === 'empty' ? [] : disputes();
      var tbl = c.table({ caption: 'Disputes', rowHref: function (r) { return '#/counterparty/disputes/' + r.id; }, columns: [
        { key: 'id', label: 'Dispute', mono: true }, { key: 'rc', label: 'Receipt', render: function (r) { return '<a class="e1-mono" href="#/counterparty/receipt/' + esc(r.rc) + '">' + esc(r.rc) + '</a><div class="e1p-note">' + esc(r.issuer) + '</div>'; } },
        { key: 'cls', label: 'Failure class', render: function (r) { return esc(r.cls) + '<div class="e1p-note">' + (r.kind === 'forensic' ? 'Forensic' : 'Procedural — reissue') + '</div>'; } },
        { key: 'opened', label: 'Opened', nowrap: true, render: function (r) { return esc(fmt.date(r.opened)); } },
        { key: 'status', label: 'Status', render: function (r) { return r.status === 'open' ? c.badge('warning', 'Open') : c.badge('good', 'Resolved'); } }
      ], rows: rows, empty: { icon: 'flag', title: 'No disputes.', why: 'A dispute is opened when a receipt does not verify or its terms are wrong. You have not needed one.', action: { label: 'Receipts received', href: '#/counterparty' } } });
      return wrap(cpBand('disputes', states),
        c.pageHeader({ title: 'Disputes', eyebrow: 'Counterparty portal', lead: 'A record of what each side ran and what it showed. elan1 does not adjudicate between two organisations.', actions: c.button('Open a dispute', { kind: 'primary', icon: 'flag', attrs: 'data-action="p-dispute-new" data-value="' + esc(q.new || '') + '"' }) }) +
        c.callout({ kind: 'rule', title: 'elan1 does not adjudicate between two organisations.', body: '<p>We supply the specification, the verifier and our own records about our own conduct. Any request to declare a counterparty wrong is declined in writing.</p>' }) + '<div class="e1p-gap"></div>' + tbl);
    },
    mount: function (el, p, q) { if (q.new && E1.atLeast('L3')) setTimeout(function () { openDisputeModal(q.new); }, 30); }
  });
  function openDisputeModal(rcid) {
    E1.modal({ title: 'Open a dispute', eyebrow: 'Recorded in ACME\'s chain · visible to both sides', body: '<div class="e1-stack">' +
      c.field('Receipt', c.select({ id: 'p-drc', options: CP.receipts.map(function (r) { return { value: r.id, label: r.id + ' · ' + r.issuer }; }), value: rcid || 'RC-78299' }), { id: 'p-drc' }) +
      c.field('Failure class', c.select({ id: 'p-dcls', options: ['Digest mismatch (forensic)', 'Signature invalid (a key-document route is the first suspect)', 'Inclusion path invalid', 'Audience or expiry (procedural — reissue)'] }), { id: 'p-dcls' }) +
      c.field('What happened', c.textarea({ id: 'p-dwhat', rows: 3, describedBy: 'p-dwhat-msg' }), { id: 'p-dwhat', required: true, help: 'At least 12 characters. State what you ran and what it printed.' }) + '</div>',
      actions: [{ label: 'Cancel', kind: 'ghost' }, { label: 'Open dispute', kind: 'primary', onClick: function (e, close, root) {
        var t = sel('#p-dwhat', root); if (String(t.value || '').trim().length < 12) { showFieldError(t, 'Write at least 12 characters: what you ran, and what it printed.'); return false; }
        var rc = rcById(sel('#p-drc', root).value), cls = sel('#p-dcls', root).value, list = E1.store.get('p.disputes', []) || [];
        var id = 'DSP-2028-' + String(4 + list.length).padStart(3, '0');
        list.unshift({ id: id, rc: rc.id, issuer: rc.issuer, cls: cls.split(' (')[0], kind: /procedural/.test(cls) ? 'procedural' : 'forensic', opened: new Date().toISOString(), status: 'open', ours: String(t.value).trim(), theirs: 'not yet shared', next: 'Capture the exact bytes, then ask the issuer to run the same verifier version.', bytes: hx('b' + id, 64) });
        E1.store.set('p.disputes', list); close(); E1.toast('Recorded in ACME\'s chain. The issuer is told by you, not by elan1.', 'good', { title: id + ' opened' }); E1.go('/counterparty/disputes/' + id);
      } }] });
  }
  E1.action('p-dispute-new', function (el) { openDisputeModal(el.getAttribute('data-value')); });
  E1.route('/counterparty/disputes/:id', {
    title: function (p) { return 'Dispute ' + p.id; }, layout: 'bare', bareTitle: 'Counterparty portal', example: '/counterparty/disputes/DSP-2028-003',
    render: function (p) {
      var d = null; disputes().forEach(function (x) { if (x.id === p.id) d = x; });
      if (!d) return wrap(cpBand('disputes'), c.pageHeader({ title: 'No dispute ' + p.id, eyebrow: 'Counterparty portal', back: ['Disputes', '#/counterparty/disputes'] }) + c.empty({ icon: 'flag', title: 'There is no dispute with that id.', why: 'Disputes are opened by your organisation or the issuer and listed on the disputes page.', action: { label: 'Disputes', href: '#/counterparty/disputes' } }));
      var steps = '<ol class="e1p-steps">' +
        '<li><div><h3>Capture the exact bytes</h3><p>The file as received, before anyone re-saves it.</p>' + c.kv([['SHA-256', c.hash(d.bytes, { label: 'Receipt bytes' }), { html: true }]], { compact: true }) + '</div></li>' +
        '<li><div><h3>Both parties run the published verifier, same version</h3>' + c.kv([['ACME (us)', 'elan1-verify v1.0.3 · ' + d.ours, { mono: true }], ['Issuer', d.theirs, { mono: true }]], { compact: true }) + '</div></li>' +
        '<li><div><h3>Failure class</h3><p><strong>' + esc(d.cls) + '</strong> — ' + (d.kind === 'forensic' ? 'forensic. Somebody\'s copy was altered, or a key was wrong. Not a price negotiation.' : 'procedural, not forensic. Reissue.') + '</p></div></li>' +
        '<li><div><h3>Next move</h3><p>' + esc(d.next) + '</p></div></li></ol>';
      return wrap(cpBand('disputes'),
        c.pageHeader({ title: 'Dispute ' + d.id, eyebrow: 'Counterparty portal · receipt ' + d.rc, back: ['Disputes', '#/counterparty/disputes'], lead: d.issuer + ' · ' + d.cls,
          actions: d.status === 'open' ? c.button('Request a bundle from the issuer', { icon: 'copy', attrs: 'data-copy="For dispute ' + d.id + ' please export an evidence bundle covering the record behind ' + d.rc + ' and the ten records either side, and send it with the key fingerprint by a separate channel." data-copy-label="Request text"' }) + c.button('Mark resolved', { attrs: 'data-action="p-dispute-resolve" data-value="' + d.id + '"' }) : '',
          meta: (d.status === 'open' ? c.badge('warning', 'Open') : c.badge('good', 'Resolved')) + '<span class="e1p-fact">' + c.icon('calendar', 14) + '<span>Opened ' + esc(fmt.dateTime(d.opened)) + '</span></span>' }) +
        c.callout({ kind: 'rule', title: 'elan1 does not adjudicate between two organisations.', body: '<p>We supply the specification, the verifier and our own records about our own conduct.</p>' }) + '<div class="e1p-gap"></div>' + steps);
    }
  });
  E1.action('p-dispute-resolve', function (el) {
    var id = el.getAttribute('data-value');
    E1.modal({ title: 'Mark ' + id + ' resolved', body: c.field('Resolution, in a sentence', c.textarea({ id: 'p-dres', rows: 3, describedBy: 'p-dres-msg' }), { id: 'p-dres', required: true, help: 'At least 12 characters. Both sides can read it.' }), actions: [{ label: 'Cancel', kind: 'ghost' }, { label: 'Mark resolved', kind: 'primary', onClick: function (e, close, root) {
      var t = sel('#p-dres', root); if (String(t.value || '').trim().length < 12) { showFieldError(t, 'Write the resolution in at least 12 characters.'); return false; }
      var list = E1.store.get('p.disputes', []) || [], hit = false;
      list.forEach(function (x) { if (x.id === id) { x.status = 'resolved'; x.next = String(t.value).trim(); hit = true; } });
      if (!hit) { DISPUTES.forEach(function (x) { if (x.id === id) { x.status = 'resolved'; x.next = String(t.value).trim(); } }); }
      E1.store.set('p.disputes', list); close(); E1.render(); E1.toast('Resolution recorded in ACME\'s chain.', 'good');
    } }] });
  });

  E1.route('/counterparty/register', {
    title: 'Issuers you accept', layout: 'bare', bareTitle: 'Counterparty portal', keywords: 'counterparty register pinned fingerprint key document trust anchor',
    render: function (p, q) {
      var pinned = E1.store.get('p.pins', []) || [];
      var rows = [
        { org: 'ar-org:kaverispinning.example', name: 'Kaveri Spinning Mills Pvt Ltd', st: 'active', route: 'Pinned fingerprint', keys: 'kav-2028q1-01 · 2028-01-01 →', first: 'Mar 2028', last: '19 Mar 2028', line: 'Accepted on a pinned fingerprint since March 2028' },
        { org: 'ar-org:suryaauto.example', name: 'Surya Auto Parts Pvt Ltd', st: 'active', route: 'Key document', keys: 'sap-2028-02 · 2028-02-10 →', first: 'Feb 2028', last: '17 Mar 2028', line: 'Accepted on a key document fetched four minutes ago' },
        { org: 'ar-org:deccanfreight.example', name: 'Deccan Freight Carriers', st: 'unknown', route: '—', keys: '—', first: '18 Mar 2028', last: '—', line: 'GATE.COUNTERPARTY_UNKNOWN — register under the due diligence you already run' },
        { org: 'ar-org:[redacted].example', name: '[redacted]', st: 'sanctioned', route: '—', keys: '—', first: '—', last: '—', line: 'GATE.COUNTERPARTY_SANCTIONED — never overridable; escalate to compliance' }
      ].concat(pinned);
      var lock = cpLock('Your issuer register arrives with receipts, at Level 3 Proven');
      if (lock) return wrap(cpBand('register'), c.pageHeader({ title: 'Issuers you accept', eyebrow: 'Counterparty portal' }) + lock);
      return wrap(cpBand('register'),
        c.pageHeader({ title: 'Issuers you accept', eyebrow: 'Counterparty portal', lead: 'Who may send you receipts, and how you know their key. A fingerprint you pinned out of band is the strongest route; a hint inside a receipt is never trusted.', actions: c.button('Pin a fingerprint', { kind: 'primary', icon: 'fingerprint', attrs: 'data-action="p-pin" data-value="' + esc(q.add ? decodeURIComponent(q.add) : '') + '"' }) }) +
        c.table({ caption: 'Issuer register', columns: [
          { key: 'org', label: 'Issuer', render: function (r) { return esc(r.name) + '<div class="e1p-note e1-mono">' + esc(r.org) + '</div>'; } },
          { key: 'st', label: 'Status', render: function (r) { return r.st === 'active' ? c.badge('good', 'Active') : r.st === 'sanctioned' ? c.badge('critical', 'Sanctioned') : r.st === 'pending' ? c.badge('warning', 'Waiting on a second approver') : c.badge('neutral', 'Unknown'); } },
          { key: 'route', label: 'Discovery route' }, { key: 'keys', label: 'Accepted keys and windows', mono: true },
          { key: 'last', label: 'Last verified' }, { key: 'line', label: 'Basis', render: function (r) { return '<span class="e1p-note">' + esc(r.line) + '</span>'; } }
        ], rows: rows }) +
        '<div class="e1p-grid e1p-grid--4 e1p-mt">' + [['1', 'Pinned fingerprint', 'Highest — obtained out of band, by you.'], ['2', 'Issuer key document', 'Moderate — fetched from the issuer\'s own domain; the fetch is shown.'], ['3', 'Trust anchor attestation', 'Specified, not operated. elan1 never operates a trust anchor.'], ['4', 'In-receipt hint', 'None. A hint is used to look up, never to trust.']].map(function (x) { return '<div class="e1p-panel"><p class="e1-label">Route ' + x[0] + '</p><h3>' + esc(x[1]) + '</h3><p>' + esc(x[2]) + '</p></div>'; }).join('') + '</div>');
    },
    mount: function (el, p, q) { if (q.add && E1.atLeast('L3')) setTimeout(function () { openPin(decodeURIComponent(q.add)); }, 30); }
  });
  function openPin(org) {
    E1.modal({ title: 'Pin an issuer\'s fingerprint', eyebrow: 'Route 1 · the strongest', body: '<div class="e1-stack">' +
      c.field('Issuer org_id', c.input({ id: 'p-porg', mono: true, value: org || '', placeholder: 'ar-org:example.com', describedBy: 'p-porg-msg' }), { id: 'p-porg', required: true }) +
      c.field('Fingerprint', c.input({ id: 'p-pfp', mono: true, placeholder: 'ed25519:…', describedBy: 'p-pfp-msg' }), { id: 'p-pfp', required: true, help: 'Type it from the signed letter or page you were given. Never paste it from a receipt.' }) +
      c.field('How it reached you', c.select({ id: 'p-pch', options: ['Signed letter on the issuer\'s letterhead', 'Printed page handed over in person', 'DNS record we resolved ourselves'] }), { id: 'p-pch' }) + '</div>',
      actions: [{ label: 'Cancel', kind: 'ghost' }, { label: 'Send for approval', kind: 'gate', onClick: function (e, close, root) {
        var o = sel('#p-porg', root), f = sel('#p-pfp', root);
        if (!/^ar-org:[a-z0-9.-]+$/.test(String(o.value).trim())) { showFieldError(o, 'Use the form ar-org:<domain>.'); return false; }
        if (String(f.value).trim().length < 12) { showFieldError(f, 'A fingerprint is longer than that — type the whole value you were given.'); return false; }
        var list = E1.store.get('p.pins', []) || [];
        list.push({ org: String(o.value).trim(), name: String(o.value).trim().replace('ar-org:', ''), st: 'pending', route: 'Pinned fingerprint', keys: String(f.value).trim().slice(0, 24) + '…', first: 'today', last: '—', line: 'Registration is a governed write; Arvind Shah approves it' });
        E1.store.set('p.pins', list); close(); E1.render(); E1.toast('Registration waits on a second approver. Nothing is accepted from this issuer until then.', 'warning', { title: 'Sent for approval' });
      } }] });
  }
  E1.action('p-pin', function (el) { openPin(el.getAttribute('data-value')); });

  /* ==========================================================================
     PARTNER PORTAL  (/partners/portal…) — introduce, implement, verify, without overclaiming
     ========================================================================== */
  var PT = D.partner = {
    firm: 'Suresh Agarwal & Co, Chartered Accountants', place: 'Coimbatore', mark: 'AG', person: 'CA Suresh Agarwal', role: 'Managing partner',
    share: 0.18, floorL1: 180000,
    clients: [
      { id: 'kaveri-spinning', name: 'Kaveri Spinning Mills Pvt Ltd', city: 'Tiruppur', stage: 'live', since: '2026-09-01', level: 'L1', pack: 'ledger1', source: 'partner', list: 180000, access: 'Assurance overview (read) until 31 Dec 2026 · no records', contact: 'Meenakshi Iyer, Owner', next: 'Introduce their statutory auditor (Iyer Menon & Co.) to the ledger1 pilot protocol.' },
      { id: 'sahyadri-agro', name: 'Sahyadri Agro Foods LLP', city: 'Nashik', stage: 'onboarding', since: '2026-09-15', level: 'L1', pack: 'invoice1', source: 'partner', list: 180000, access: 'None yet — onboarding in progress', contact: 'Finance controller', next: 'Declaration authoring: the six never-skippable gates are in; budget gate open.' },
      { id: 'nilgiri-tea', name: 'Nilgiri Tea Traders Pvt Ltd', city: 'Coonoor', stage: 'stopped', since: '2026-08-20', level: 'L1', pack: 'ledger1', source: 'partner', list: 180000, access: 'Assurance overview (read)', contact: 'Owner', next: 'Writes paused by the client on 24 Sep 16:05 (suspected credential exposure). First-line support ticket open; elan1 incident owner leads.' },
      { id: 'deccan-auto', name: 'Deccan Auto Components Pvt Ltd', city: 'Pune', stage: 'live', since: '2026-08-11', level: 'L1', pack: 'ledger1', source: 'elan1', list: 180000, access: 'First-line support only · no records', contact: 'Compliance head', next: 'Support rota only — elan1-sourced, so no partner share.' },
      { id: 'coimbatore-castings', name: 'Coimbatore Castings Pvt Ltd', city: 'Coimbatore', stage: 'qualified', since: '2026-09-10', level: '—', pack: 'ledger1', source: 'partner', list: 180000, access: 'None — not a tenant', contact: 'Promoter', next: 'Working session booked 2 Oct; bring their auditor\'s name.' },
      { id: 'shree-murugan', name: 'Shree Murugan Traders', city: 'Madurai', stage: 'lost', since: '2026-08-28', level: '—', pack: '—', source: 'partner', list: 0, access: 'None', contact: 'Proprietor', next: 'Chose to stay on Tally without agents. Recorded as lost, with the reason.' }
    ],
    engineers: [
      { name: 'CA Suresh Agarwal', track: 'Verifier', mods: 6, test: '28 / 30', testOn: '2026-09-02', st: 'certified', issued: '2026-09-02', exp: '2027-09-01' },
      { name: 'Imran Qureshi', track: 'Verifier', mods: 6, test: '21 / 30', testOn: '2026-09-18', st: 'failed', retake: '2026-10-08' },
      { name: 'Neha Joshi', track: 'Implementer', mods: 4, test: '—', testOn: null, st: 'training' }
    ]
  };
  var STAGE = { live: ['good', 'Live'], onboarding: ['info', 'Onboarding'], stopped: ['serious', 'Stopped by the client'], qualified: ['neutral', 'Qualified'], lost: ['neutral', 'Lost'] };
  function ptBand(active, states) {
    return band({
      portal: 'Partner portal', mark: PT.mark, viewer: [PT.person, PT.role], eyebrow: 'Partner portal · signed in', org: PT.firm + ', ' + PT.place, sub: 'Signed in as ' + PT.person + ' · ' + PT.role,
      facts: [
        { icon: 'stamp', html: 'Registered Introducer since 2 Sep 2026 · Certified Verifier <strong>not yet held</strong>' },
        { icon: 'rupee', html: 'Partners keep <strong>18%</strong> of list on partner-sourced revenue [modelled]' },
        { icon: 'scale', html: 'No partner or integrator may speak to a regulator for elan1' }
      ],
      tools: statesMenu(states) + sandboxTag(),
      tabs: [
        { id: 'home', label: 'Overview', href: '#/partners/portal', icon: 'home' },
        { id: 'clients', label: 'Clients and deals', href: '#/partners/portal/clients', icon: 'building', count: PT.clients.length },
        { id: 'engineers', label: 'Certified engineers', href: '#/partners/portal/engineers', icon: 'users' },
        { id: 'claims', label: 'Claim-boundary test', href: '#/partners/portal/claims', icon: 'scale' }
      ], active: active
    });
  }
  function shareOf(cl) { return cl.source === 'partner' && cl.list ? Math.round(cl.list * PT.share) : 0; }
  function dealsTable(rows, o) {
    o = o || {};
    return c.table({ caption: 'Clients and deals', rowHref: function (r) { return '#/partners/portal/clients/' + r.id; }, columns: [
      { key: 'name', label: 'Client', render: function (r) { return esc(r.name) + '<div class="e1p-note">' + esc(r.city) + '</div>'; } },
      { key: 'stage', label: 'Stage', render: function (r) { return c.badge(STAGE[r.stage][0], STAGE[r.stage][1]); } },
      { key: 'level', label: 'Level · pack', render: function (r) { return (r.level === '—' ? '<span class="e1-muted">—</span>' : c.level(r.level, { short: true })) + ' <span class="e1-mono e1p-note">' + esc(r.pack) + '</span>'; } },
      { key: 'source', label: 'Source', render: function (r) { return r.source === 'partner' ? 'Partner-sourced' : 'elan1-sourced'; } },
      { key: 'list', label: 'List / yr [modelled]', align: 'right', render: function (r) { return r.list ? c.amount(r.list) : '<span class="e1-muted">—</span>'; } },
      { key: 'share', label: 'Your 18%', align: 'right', render: function (r) { var s = shareOf(r); return s ? c.amount(s) + (r.stage === 'qualified' ? '<div class="e1p-note">if won</div>' : '') : '<span class="e1p-note">' + (r.source === 'elan1' ? '₹0 · not partner-sourced' : '—') + '</span>'; } }
    ], rows: rows, empty: o.empty });
  }
  E1.route('/partners/portal', {
    title: 'Partner portal', layout: 'bare', bareTitle: 'Partner portal', keywords: 'partner programme certification deals share verifier',
    render: function () {
      var won = PT.clients.filter(function (x) { return x.stage === 'live' || x.stage === 'onboarding' || x.stage === 'stopped'; });
      var accrued = Math.round(shareOf(PT.clients[0]) / 12 * (24 / 30));
      var levels = c.table({ caption: 'Partner levels and what each may claim', columns: [
        { key: 'l', label: 'Level', render: function (r) { return '<strong>' + esc(r.l) + '</strong><div class="e1p-note">' + esc(r.fee) + '</div>'; } },
        { key: 'may', label: 'May say or do' }, { key: 'not', label: 'Must not say or do' }, { key: 'you', label: 'Your firm', html: true }
      ], rows: [
        { l: 'Introducer', fee: 'Registered · no fee', may: 'Introduce a client; explain the three levels in the level\'s own words', not: 'Quote a price below list; promise a level the client has not reached', you: c.badge('good', 'Held since 2 Sep 2026') },
        { l: 'Implementer', fee: '₹1,50,000 / firm / yr [modelled]', may: 'Author and validate declarations; install packs; run sandbox proofs', not: 'Certify a declaration you authored; set an autonomy level', you: c.badge('neutral', 'Not held · 1 engineer in training') },
        { l: 'Verifier', fee: '₹1,50,000 / firm / yr [modelled]', may: 'Run and explain the offline verifier for clients and their auditors', not: 'Verify for a client you implemented for; call a pass an audit opinion', you: c.badge('warning', 'Not held · 1 of 2 engineers passed') }
      ] });
      return wrap(ptBand('home'),
        c.pageHeader({ title: 'Your partnership with elan1', eyebrow: 'Partner portal', lead: 'What your firm may claim, the clients you introduced, and the share you keep — every number shown with the record it comes from.', actions: c.button('Take the claim-boundary test', { kind: 'primary', icon: 'scale', href: '#/partners/portal/claims' }) + c.button('Refer a client', { icon: 'plus', attrs: 'data-action="p-refer"' }) }) +
        c.callout({ kind: 'caveat', title: 'The programme opens with Level 1 general availability.', body: '<p>Certification levels and the 18% share are modelled terms, not a published price list. elan1 is pre-revenue; partner figures below are sample data.</p>' }) + '<div class="e1p-gap"></div>' +
        '<div class="e1p-grid e1p-grid--4">' +
        c.stat({ label: 'Clients introduced', value: String(PT.clients.filter(function (x) { return x.source === 'partner'; }).length), note: won.length + ' live, onboarding or stopped', href: '#/partners/portal/clients' }) +
        c.stat({ label: 'Share accrued, Sep 2026', value: fmt.inr(accrued), note: '[modelled] Kaveri, 24 days of 30', href: '#/partners/portal/clients/kaveri-spinning' }) +
        c.stat({ label: 'Share paid to date', value: '₹0', note: 'First statement after the first invoice' }) +
        c.stat({ label: 'Engineers certified', value: '1 of 3', note: 'Verifier needs 2 per firm', href: '#/partners/portal/engineers' }) + '</div>' + '<div class="e1p-gap"></div>' +
        c.section({ id: 'cert', title: 'Certification and what it lets you say', lead: 'Certification is dated and scoped. Until a level is held, your firm may not describe itself with it.', body: levels }) +
        c.section({ id: 'deals', title: 'Clients and deals', actions: c.button('All clients', { size: 'sm', href: '#/partners/portal/clients', iconRight: 'arrow-right' }), body: dealsTable(PT.clients.slice(0, 4)) }) +
        '<div class="e1p-grid e1p-grid--3 e1p-mt">' +
        '<div class="e1p-panel"><p class="e1-label">How the share works</p><h3>18% of list, partner-sourced only</h3><p>Shown as a contra line on elan1\'s invoice to the client. Refusals are never billed, so they never carry a share. The floor is never discounted — by anyone.</p></div>' +
        '<div class="e1p-panel"><p class="e1-label">What you never do</p><h3>Speak to a regulator for us</h3><p>Only elan1\'s founder speaks to regulators, with the elan1 lead for technical detail. Refer any regulator question to them.</p></div>' +
        '<div class="e1p-panel"><p class="e1-label">Support</p><h3>You are first line</h3><p>You see what each client grants you, and nothing more. Records stay with the client unless they grant access, time-boxed.</p></div></div>');
    }
  });
  E1.action('p-refer', function () {
    E1.modal({ title: 'Refer a client', eyebrow: 'Partner-sourced from the day it is recorded', body: '<div class="e1-stack">' +
      c.field('Company', c.input({ id: 'p-rco', placeholder: 'Legal name', describedBy: 'p-rco-msg' }), { id: 'p-rco', required: true }) +
      c.field('Their statutory auditor', c.input({ id: 'p-raud', placeholder: 'Firm name' }), { id: 'p-raud', optional: true, help: 'A pilot needs a named auditor from day one.' }) +
      c.field('Why they need it', c.textarea({ id: 'p-rwhy', rows: 3, describedBy: 'p-rwhy-msg' }), { id: 'p-rwhy', required: true, help: 'At least 12 characters, in the client\'s words if you can.' }) + '</div>',
      actions: [{ label: 'Cancel', kind: 'ghost' }, { label: 'Record referral', kind: 'primary', onClick: function (e, close, root) {
        var co = sel('#p-rco', root), why = sel('#p-rwhy', root);
        if (String(co.value).trim().length < 3) { showFieldError(co, 'Name the company.'); return false; }
        if (String(why.value).trim().length < 12) { showFieldError(why, 'Write at least 12 characters.'); return false; }
        close(); E1.toast('A named person at elan1 replies within two working days.', 'good', { title: 'Referral recorded: ' + String(co.value).trim() });
      } }] });
  });
  E1.route('/partners/portal/clients', {
    title: 'Clients and deals', layout: 'bare', bareTitle: 'Partner portal', keywords: 'partner clients deals pipeline share',
    render: function (p, q) {
      var st = q.stage || 'all';
      var rows = q.state === 'empty' ? [] : PT.clients.filter(function (x) { return st === 'all' || x.stage === st; });
      var total = PT.clients.filter(function (x) { return x.stage === 'live' || x.stage === 'onboarding' || x.stage === 'stopped'; }).reduce(function (a, x) { return a + shareOf(x); }, 0);
      return wrap(ptBand('clients', [{ label: 'All clients', href: '#/partners/portal/clients' }, { label: 'No clients yet', href: '#/partners/portal/clients?state=empty' }]),
        c.pageHeader({ title: 'Clients and deals', eyebrow: 'Partner portal', lead: 'Every client you introduced or support, with its stage, level and your share. Lost deals stay listed, with the reason.', actions: c.button('Refer a client', { kind: 'primary', icon: 'plus', attrs: 'data-action="p-refer"' }),
          meta: '<span class="e1p-fact">' + c.icon('rupee', 14) + '<span>Annual share on won, partner-sourced clients: <strong class="e1-mono">' + esc(fmt.inr(total)) + '</strong> [modelled]</span></span>' }) +
        c.toolbar(c.filters(['all', 'live', 'onboarding', 'stopped', 'qualified', 'lost'].map(function (s) { return { label: s === 'all' ? 'All' : STAGE[s][1], href: s === 'all' ? '#/partners/portal/clients' : '#/partners/portal/clients?stage=' + s, active: st === s }; }), { label: 'Stage' })) +
        dealsTable(rows, { empty: { icon: 'building', title: q.state === 'empty' ? 'You have not introduced a client yet.' : 'No client at this stage.', why: q.state === 'empty' ? 'Clients you refer appear here from the day the referral is recorded, and count as partner-sourced from then.' : 'Try another stage.', action: q.state === 'empty' ? { label: 'Refer a client', href: '#/partners/portal' } : { label: 'All clients', href: '#/partners/portal/clients' } } }));
    }
  });
  E1.route('/partners/portal/clients/:id', {
    title: function (p) { var cl = null; PT.clients.forEach(function (x) { if (x.id === p.id) cl = x; }); return cl ? cl.name : 'Client'; }, layout: 'bare', bareTitle: 'Partner portal', example: '/partners/portal/clients/kaveri-spinning',
    render: function (p) {
      var cl = null; PT.clients.forEach(function (x) { if (x.id === p.id) cl = x; });
      if (!cl) return wrap(ptBand('clients'), c.pageHeader({ title: 'Not one of your clients', eyebrow: 'Partner portal', back: ['Clients and deals', '#/partners/portal/clients'] }) + c.empty({ icon: 'building', title: 'There is no client “' + p.id + '” linked to your firm.', why: 'You see only the clients you introduced or support. A company that is an elan1 tenant but not linked to you stays invisible here, by design.', action: { label: 'Clients and deals', href: '#/partners/portal/clients' } }));
      var s = shareOf(cl), isTenant = cl.level !== '—';
      var timeline = [
        { time: fmt.date(cl.since), title: cl.stage === 'lost' ? 'Referral recorded' : 'Referral recorded — partner-sourced from this day', state: 'neutral' },
        cl.stage === 'live' || cl.stage === 'stopped' ? { time: fmt.date(cl.since), title: 'Went live at ' + lvlName(cl.level), body: 'First governed write in production.', state: 'good' } : null,
        cl.stage === 'stopped' ? { time: '24 Sep 2026, 16:05 IST', title: 'Writes paused by the client', body: 'Suspected credential exposure. Stopped by Meenakshi Iyer and Arjun Mehta. Takes effect at the next write.', state: 'serious' } : null,
        cl.stage === 'lost' ? { time: '12 Sep 2026', title: 'Lost', body: cl.next, state: 'neutral' } : null
      ].filter(Boolean);
      return wrap(ptBand('clients'),
        c.pageHeader({ title: cl.name, eyebrow: 'Partner portal · client', back: ['Clients and deals', '#/partners/portal/clients'], lead: cl.next,
          actions: isTenant ? c.button('Ask for time-boxed access', { icon: 'key', attrs: 'data-action="p-access" data-value="' + esc(cl.name) + '"' }) + c.button('Open a support ticket', { kind: 'ghost', icon: 'message', attrs: 'data-action="p-ticket" data-value="' + esc(cl.name) + '"' }) : '',
          meta: c.badge(STAGE[cl.stage][0], STAGE[cl.stage][1]) + (isTenant ? c.level(cl.level) : '') + '<span class="e1p-fact">' + c.icon('map-pin', 14) + '<span>' + esc(cl.city) + '</span></span>' }) +
        (cl.stage === 'stopped' ? c.callout({ kind: 'warning', title: 'Writes are paused for this organisation.', body: '<p>elan1\'s incident owner leads; you are first line for the client\'s questions. Do not advise them to lift the stop — lifting it is their governed decision.</p>' }) + '<div class="e1p-gap"></div>' : '') +
        '<div class="e1p-main-side"><div>' +
        c.section({ id: 'deal', title: 'The deal', body: c.kv([['Source', cl.source === 'partner' ? 'Partner-sourced' : 'elan1-sourced — you support first line'], ['Pack', cl.pack, { mono: true }], ['List price / yr', cl.list ? fmt.inr(cl.list) + ' · L1 platform floor [modelled]' : '—'], ['Your share / yr', s ? fmt.inr(s) + ' (18% of list) [modelled]' + (cl.stage === 'qualified' ? ' — if won' : '') : '₹0'], ['Contact', cl.contact]], { compact: true }) }) +
        c.section({ id: 'history', title: 'History', body: c.timeline(timeline) }) +
        '</div><div class="e1-stack">' +
        c.card({ title: 'What the client lets you see', body: '<p style="margin:0 0 10px;color:var(--text-primary)">' + esc(cl.access) + '</p><p class="e1p-note" style="margin:0">Records stay with the client. Access is granted by the client as a governed write, time-boxed, and every view you make is recorded in their chain.</p>' }) +
        (cl.id === 'kaveri-spinning' ? c.card({ title: 'Their auditor', body: '<p class="e1p-note" style="margin:0 0 10px">Iyer Menon & Co. has a read-only auditor login for the interim visit.</p>' + c.button('What the auditor sees', { size: 'sm', href: '#/auditor', iconRight: 'arrow-right' }) }) : '') +
        c.card({ title: 'Their public trust centre', body: c.button('Open trust centre', { size: 'sm', href: '#/trust', icon: 'globe', full: true }) }) + '</div></div>');
    }
  });
  E1.action('p-access', function (el) {
    E1.modal({ title: 'Ask ' + el.getAttribute('data-value') + ' for access', eyebrow: 'The client decides · time-boxed', body: '<div class="e1-stack">' + c.field('What you need to see', c.select({ id: 'p-aw', options: ['Assurance overview (read)', 'Refusals for the last 30 days (read)', 'Declaration versions (read)'] }), { id: 'p-aw' }) + c.field('For how long', c.select({ id: 'p-al', options: ['7 days', '30 days', 'Until 31 Dec 2026'] }), { id: 'p-al' }) + c.field('Why', c.textarea({ id: 'p-ay', rows: 3, describedBy: 'p-ay-msg' }), { id: 'p-ay', required: true, help: 'At least 12 characters. The client sees exactly this.' }) + '</div>',
      actions: [{ label: 'Cancel', kind: 'ghost' }, { label: 'Send request', kind: 'primary', onClick: function (e, close, root) { var t = sel('#p-ay', root); if (String(t.value).trim().length < 12) { showFieldError(t, 'Say why in at least 12 characters.'); return false; } close(); E1.toast('The client\'s owner decides. Nothing is visible to you until they grant it.', 'info', { title: 'Access requested' }); } }] });
  });
  E1.action('p-ticket', function (el) { E1.toast('A named person on elan1\'s support rota picks it up; first response median 3 h 10 m [measured in sample].', 'info', { title: 'Support ticket opened for ' + el.getAttribute('data-value') }); });

  E1.route('/partners/portal/engineers', {
    title: 'Certified engineers', layout: 'bare', bareTitle: 'Partner portal', keywords: 'partner engineers certification training claim boundary',
    render: function () {
      return wrap(ptBand('engineers'),
        c.pageHeader({ title: 'Certified engineers', eyebrow: 'Partner portal', lead: 'Each certification names its holder, its scope and its dates. An expired or failed certification is shown, not hidden.', actions: c.button('Enrol an engineer', { kind: 'primary', icon: 'plus', attrs: 'data-action="p-export" data-value="Enrolment form (prototype)"' }) }) +
        c.table({ caption: 'Engineers', columns: [
          { key: 'name', label: 'Engineer', render: function (r) { return c.actor({ name: r.name, kind: 'person', size: 'sm', role: r.track + ' track' }); } },
          { key: 'mods', label: 'Modules', render: function (r) { return c.progress(r.mods, 6, { label: r.mods + ' of 6' }); } },
          { key: 'test', label: 'Claim-boundary test', render: function (r) { return r.testOn ? '<span class="e1-mono">' + esc(r.test) + '</span><div class="e1p-note">' + esc(fmt.date(r.testOn)) + ' · pass mark 27 / 30</div>' : '<span class="e1-muted">Not taken</span>'; } },
          { key: 'st', label: 'Certification', render: function (r) { return r.st === 'certified' ? c.badge('good', 'Certified ' + r.track) + '<div class="e1p-note">Issued ' + esc(fmt.date(r.issued)) + ' · expires ' + esc(fmt.date(r.exp)) + ' · scope: offline verifier walkthroughs for ledger1 clients</div>' : r.st === 'failed' ? c.badge('serious', 'Did not pass') + '<div class="e1p-note">Retake booked ' + esc(fmt.date(r.retake)) + '</div>' : c.badge('info', 'In training'); } }
        ], rows: PT.engineers }) +
        c.callout({ kind: 'rule', title: 'A certification without a date and a scope is not a certification.', body: '<p>“Certified” is only ever written with who holds it, what it covers and when it was issued and expires.</p>' }));
    }
  });

  var CLAIMS = [
    ['Every governed change of these types went through stated rules, with a named actor.', 'may', 'The buyer promise, first sentence. True at every level.'],
    ['Your books are verified.', 'not', 'A record shows a change went through rules. It says nothing about whether the books are complete or the transactions genuine.'],
    ['elan1 records are tamper-proof.', 'not', 'Banned everywhere. Say “tamper-evident”.'],
    ['At Level 1 the records are hash-chained, not signed.', 'may', 'The honest Level 1 sentence.'],
    ['The RBI has accepted elan1\'s evidence format.', 'not', 'No regulator has reviewed or approved elan1, and no partner speaks to a regulator for us.'],
    ['Refused attempts are recorded in full and cost ₹0.', 'may', 'Refusals meter at quantity zero, and the database enforces it.'],
    ['At Level 1, your auditor can check this file offline with software they did not get from us.', 'not', 'That is a Level 2 sentence. At Level 1 there is no signed bundle.'],
    ['elan1 is certified to ISO/IEC 42001.', 'not', 'elan1 holds no certification of any kind.'],
    ['A refusal is a correct outcome, not an error.', 'may', 'Refusals are free, recorded, and shown on the invoice at ₹0.'],
    ['The agent earned A3, so it is safe.', 'not', 'Earned autonomy is a graduated permission with an evidence trail and a revocation path — not a safety argument.']
  ];
  E1.route('/partners/portal/claims', {
    title: 'Claim-boundary test', layout: 'bare', bareTitle: 'Partner portal', keywords: 'claim boundary test partner training banned words',
    render: function () {
      var qs = CLAIMS.map(function (cl, i) {
        return '<div class="e1p-quiz__q" data-q="' + i + '"><p>“' + esc(cl[0]) + '”</p><div class="e1-seg e1-seg--sm" role="radiogroup" aria-label="Statement ' + (i + 1) + '">' +
          '<button type="button" class="e1-seg__item" role="radio" aria-checked="false" data-action="p-quiz" data-value="' + i + ':may">May say</button><button type="button" class="e1-seg__item" role="radio" aria-checked="false" data-action="p-quiz" data-value="' + i + ':not">Must not say</button></div>' +
          '<p class="e1p-quiz__why" hidden></p></div>';
      }).join('');
      return wrap(ptBand('claims'),
        c.pageHeader({ title: 'Claim-boundary test', eyebrow: 'Partner portal · practice round', lead: 'Ten sentences a client might hear from you. For each, choose whether a partner may say it. The certified test has thirty and a pass mark of 27.', actions: c.button('Check my answers', { kind: 'primary', icon: 'check', attrs: 'data-action="p-quiz-check"' }) + c.button('Start again', { kind: 'ghost', icon: 'refresh', href: '#/partners/portal/claims', attrs: 'data-action="p-quiz-reset"' }) }) +
        '<div class="e1p-quiz" id="p-quiz">' + qs + '</div><div id="p-quiz-result" class="e1p-mt" aria-live="polite"></div>');
    }
  });
  E1.action('p-quiz', function (el) {
    var v = el.getAttribute('data-value').split(':'), row = el.closest('.e1p-quiz__q');
    selAll('.e1-seg__item', row).forEach(function (b) { b.setAttribute('aria-checked', String(b === el)); });
    row.setAttribute('data-a', v[1]);
  });
  E1.action('p-quiz-reset', function () { E1.render(); });
  E1.action('p-quiz-check', function () {
    var rows = selAll('#p-quiz .e1p-quiz__q'), right = 0, answered = 0;
    rows.forEach(function (row) {
      var i = Number(row.getAttribute('data-q')), a = row.getAttribute('data-a'), why = sel('.e1p-quiz__why', row), cl = CLAIMS[i];
      if (a) answered++;
      var ok = a === cl[1]; if (ok) right++;
      why.hidden = false;
      why.innerHTML = (a ? (ok ? c.badge('good', 'Right') : c.badge('serious', 'Not quite')) : c.badge('neutral', 'Not answered')) + ' <span>' + (cl[1] === 'may' ? 'May say. ' : 'Must not say. ') + esc(cl[2]) + '</span>';
    });
    var out = sel('#p-quiz-result');
    out.innerHTML = c.callout({ kind: right >= 9 ? 'good' : 'warning', title: right + ' of 10 right' + (answered < 10 ? ' · ' + (10 - answered) + ' not answered' : '') + '.', body: '<p>' + (right >= 9 ? 'Ready for the certified test (30 sentences, pass mark 27).' : 'Read the notes under each sentence, then try again. The certified test\'s pass mark is 27 of 30.') + '</p>' });
    E1.announce(right + ' of 10 right');
  });

  /* ==========================================================================
     TRUST CENTRE  (/trust) — a tenant's public trust centre (Vanta-style shape)
     ========================================================================== */
  var TRUST_TABS = ['overview', 'evidence', 'controls', 'subprocessors', 'updates', 'faq'];
  var CLAIM_BY_LEVEL = {
    L1: { lead: 'A governed write path that ends in a hash-chained proof.', say: ['Our finance agents change our books only through stated rules, and a named person approves the changes that need one.', 'Every attempt — including the refused ones — is recorded, in order, and checked every night.', 'We can show our auditor the record of any change, and reconcile it against ERPNext.'], never: ['That our records are signed, or independently verifiable — not at Level 1.', 'That our books are verified, or that the transactions are genuine.', 'That any regulator has reviewed or approved this system.'] },
    L2: { lead: 'A governed write path that ends in a signed, hash-chained, exportable proof.', say: ['Records from 12 August 2027 are signed; the 41,206 records before that date are Level 1 and are labelled so.', 'Here is a file covering a period you choose. Your auditor can check it on their own machine, offline, with software they did not get from us.', 'Here is what that file does not establish, in the profile\'s own words.'], never: ['That our earlier records are signed — they are not, and never will be.', 'That our books are verified, or that the transactions are genuine.', 'That any regulator has reviewed or approved this system.'] },
    L3: { lead: 'A governed write path whose receipts another organisation can verify without trusting anyone.', say: ['A counterparty can verify one of our writes without trusting our vendor or theirs.', 'We can disclose three fields to our auditor and five to our lender, from one bundle, and each can verify what they were given.', 'Our Level 1 and Level 2 records keep their own labels.'], never: ['That a receipt proves the underlying transaction occurred.', 'That any regulator has reviewed or approved this system.', 'That the format is an open standard — it is published, until another organisation\'s implementation passes.'] }
  };
  function trustBand(active, states) {
    return band({
      portal: 'Trust centre', mark: 'KS', viewer: ['Visitor', 'No account'], eyebrow: 'Trust centre · published by the company', org: D.tenant.name + ', ' + D.tenant.place,
      sub: 'Governed agentic finance on ERPNext · hosted by elan1 · you are viewing as a visitor, with no account',
      facts: [
        { icon: 'activity', html: 'Chain checked <strong>' + (E1.state.level === 'L1' ? '13 h ago' : '3 min ago') + '</strong> (' + (E1.state.level === 'L1' ? '24 Sep 2026, 02:10 IST' : '26 Oct 2027, 16:09 IST') + ')' },
        { icon: 'map-pin', html: 'Residency <strong>in · Mumbai</strong> (ap-south-1)' },
        { icon: 'assurance', html: 'Assurance level ' + c.level(E1.state.level) }
      ],
      tools: levelMenu('Company at') + statesMenu(states) + sandboxTag(),
      tabs: [
        { id: 'overview', label: 'Overview', href: '#/trust' }, { id: 'evidence', label: 'Evidence', href: '#/trust?tab=evidence' }, { id: 'controls', label: 'Controls', href: '#/trust?tab=controls' },
        { id: 'subprocessors', label: 'Subprocessors', href: '#/trust?tab=subprocessors' }, { id: 'updates', label: 'Updates', href: '#/trust?tab=updates' }, { id: 'faq', label: 'FAQ', href: '#/trust?tab=faq' }
      ], active: active
    });
  }
  var CONTROLS = [
    ['Residency in India', 'All tenant data in ap-south-1 (Mumbai), three availability zones. No second region.', '2026-09-01', 'Residency declaration, onboarding record'],
    ['Tenant isolation', 'Row-level security on every tenant table; cross-tenant read test in CI.', '2026-09-23', 'CI run 23 Sep 2026 · 0 cross-tenant reads'],
    ['Scoped tokens', 'Each token carries one tenant, one actor and one autonomy level.', '2026-09-02', 'Key register · 3 production tokens'],
    ['Short-lived target credentials', 'Minted ERPNext credentials expire in 10 minutes.', '2026-09-24', 'Credential log, last 24 h'],
    ['Break-glass alerting', 'Any break-glass use alerts the owner within 1 minute and is recorded in the operator\'s chain.', '2026-08-29', 'Drill 29 Aug 2026'],
    ['Proof retention', 'Audit and proof records kept 7 years, write-once, in India.', '2026-09-01', 'Storage policy'],
    ['Backups and restore', 'Point-in-time recovery, nightly, 30 days; restore drill at least quarterly.', '2026-08-12', 'Restore drill 12 Aug 2026 · restored and checked'],
    ['Incident reporting', 'CERT-In six-hour clock; tenant update within 72 hours; post-incident note within 5 working days.', '2026-09-24', 'Incident 24 Sep 15:10 · platform failure, not billed'],
    ['Erasure', 'Within 72 hours, as an irreversible governed write under dual control; the chain stays intact.', null, 'Not evidenced — no erasure request yet, and DPDP counsel opinion is pending'],
    ['Sub-processor notice', 'Sub-processor list published, with notice before any addition.', '2026-09-01', 'This page, Subprocessors tab'],
    ['Data processing agreement', 'A DPA signed with elan1 before the first real record.', '2026-08-28', 'DPA signed 28 Aug 2026 — available on request'],
    ['Consent ledger', 'Consent recorded with purpose, time, lawful basis and notice version — not a boolean column.', null, 'Not evidenced — no personal-data write types in production yet'],
    ['Security log retention', 'Security and access logs kept at least 1 year (180 days minimum in India).', '2026-09-01', 'Log policy']
  ];
  var DOCS = [
    { t: 'Chain continuity report — September 2026', L: 'L1', upd: '2026-09-24', acc: 'request', note: 'continuous · seq 1–4,089 · 19 of 23 write types' },
    { t: 'Declaration erp.ar v7, verbatim', L: 'L1', upd: '2026-09-19', acc: 'request', note: 'Certified by Arjun Mehta' },
    { t: 'Meter reconciliation — September 2026', L: 'L1', upd: '2026-09-23', acc: 'request', note: '0 mismatches, both directions' },
    { t: 'Refusal summary — last 30 days', L: 'L1', upd: '2026-09-24', acc: 'public', note: '171 refused, ₹0 · by gate and code' },
    { t: 'Data processing agreement with elan1', L: 'L1', upd: '2026-08-28', acc: 'request', note: 'Signed 28 Aug 2026' },
    { t: 'Evidence bundle — any range you choose', L: 'L2', upd: null, acc: 'request', note: 'Signed, anchored, verifiable offline' },
    { t: 'Action receipts for your transactions with us', L: 'L3', upd: null, acc: 'request', note: 'Addressed to your organisation' }
  ];
  E1.route('/trust', {
    title: 'Trust centre', layout: 'bare', bareTitle: 'Trust centre', keywords: 'trust centre security residency subprocessors evidence request access vanta',
    render: function (p, q) {
      var tab = TRUST_TABS.indexOf(q.tab) >= 0 ? q.tab : 'overview';
      var states = [{ label: 'Published', href: '#/trust' }, { label: 'Not published yet', href: '#/trust?state=private' }];
      var L = E1.state.level, CL = CLAIM_BY_LEVEL[L];
      var head = c.pageHeader({ title: 'Kaveri Spinning Mills — trust centre', eyebrow: 'Trust centre · ' + ({ overview: 'Overview', evidence: 'Evidence', controls: 'Controls', subprocessors: 'Subprocessors', updates: 'Updates', faq: 'Questions' }[tab]), lead: 'How our finance team\'s software agents are governed, what we can truthfully claim today, and how you can check it.',
        actions: c.button('Request access to evidence', { kind: 'primary', icon: 'key', attrs: 'data-action="p-trust-request"' }) + c.button('Contact security', { icon: 'mail', attrs: 'data-copy="security@kaverispinning.example" data-copy-label="Security contact"' }) });
      if (q.state === 'private') return wrap(trustBand(tab, states), c.pageHeader({ title: 'Kaveri Spinning Mills — trust centre', eyebrow: 'Trust centre' }) + c.empty({ icon: 'globe', title: 'This company has not published its trust centre.', why: 'A trust centre is published by the company when it chooses. Until then nothing about its controls is shown here — not even a placeholder.', fill: 'You can still ask the company for evidence directly; any access they grant is read-only and time-boxed.', action: [{ label: 'Request access to evidence', href: '#/trust' }, { label: 'How verification works', href: '#/verify', kind: 'ghost' }] }));
      var body = '';
      if (tab === 'overview') {
        var kp = L === 'L1'
          ? [c.stat({ label: 'Governed writes, 1–24 Sep', value: '3,733', note: 'committed and billable' }), c.stat({ label: 'Refused, recorded in full', value: '171', note: 'at ₹0, with their codes' }), c.stat({ label: 'Chain standing', value: 'Continuous', note: 'seq 1–4,089 · 19 of 23 write types' }), c.stat({ label: 'Approved by people', value: '318', note: 'never by an agent' })]
          : [c.stat({ label: 'Signed since', value: '#41,207', note: '12 Aug 2027 · earlier records stay Level 1' }), c.stat({ label: 'Records at Level 2', value: '12,480', note: 'seq 41,207–53,686' }), c.stat({ label: 'Unanchored right now', value: '22', note: 'last counter-signature 3 min ago' }), c.stat({ label: 'Refused, in full', value: '611', note: 'in the Level 2 range, at ₹0' })];
        body = '<div class="e1p-grid e1p-grid--4">' + kp.join('') + '</div><div class="e1p-gap"></div>' +
          '<div class="e1p-main-side"><div>' +
          c.section({ id: 'claim', title: 'What we can claim at ' + lvlName(L), lead: CL.lead, body: '<div class="e1p-say"><div class="e1p-panel"><p class="e1-label">We say</p><ul>' + CL.say.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul></div><div class="e1p-panel"><p class="e1-label">We never say</p><ul>' + CL.never.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul></div></div>' + (L === 'L2' ? '<div class="e1p-gap"></div><div class="e1p-seg" role="img" aria-label="Level 1 seq 1 to 41,206; Level 2 from 41,207"><span class="e1p-seg__l1" style="flex:41206">L1 · #1–#41,206</span><span class="e1p-seg__l2" style="flex:12480">L2 · #41,207 →</span></div>' : '') }) +
          c.section({ id: 'residency', title: 'Where our data lives', body: c.kv([['Residency', 'ap-south-1 (Mumbai), three availability zones. No data outside India. No second region.'], ['Proof records', '7 years, write-once, in India'], ['Evidence bundles', L === 'L1' ? 'None exist at Level 1' : 'Generated on request and handed over; elan1 keeps none'], ['Security logs', 'At least 1 year']], { compact: true }) }) +
          c.section({ id: 'verify', title: 'Check us yourself', body: L === 'L1' ? c.callout({ kind: 'caveat', title: 'Our records cannot yet be checked by someone who does not trust elan1.', body: '<p>At Level 1 they are hash-chained, not signed. An auditor checks them by reconciling against ERPNext\'s own audit trail. Independent offline verification arrives when we reach Level 2 Attested.</p><p><a href="#/verify">How offline verification works</a></p>' }) : c.card({ body: '<p style="margin:0 0 12px;color:var(--text-primary)">Ask us for a bundle over any range, get our key fingerprint from our signed notice — not from this page — and run the free verifier offline.</p>' + c.button('The public verifier', { href: '#/verify', icon: 'terminal' }) + ' ' + c.button('Fingerprints, out of band', { href: '#/verify/fingerprints', kind: 'ghost' }) }) }) +
          '</div><div class="e1-stack">' +
          c.card({ title: 'Certifications', body: '<p style="margin:0 0 8px;color:var(--text-primary)">We make no certification claim about this system.</p><p class="e1p-note" style="margin:0">Our platform provider, elan1, holds no certification of any kind — no SOC 2, no ISO/IEC 27001, no ISO/IEC 42001, no assessment against NIST AI RMF.</p>' }) +
          c.card({ title: 'Contact', body: c.kv([['Security and evidence', 'Meenakshi Iyer, Owner'], ['E-mail', '<a href="#/trust" data-copy="security@kaverispinning.example" data-copy-label="E-mail">security@kaverispinning.example</a>', { html: true }], ['Incidents', 'Tenant update within 72 hours; CERT-In clock six hours']], { compact: true }) }) +
          c.card({ title: 'Recent updates', body: '<ul class="e1p-fields"><li><span>erp.ar v7 certified</span><span class="e1p-note">19 Sep 2026</span></li><li><span>Platform failure, 1 payment entry</span><span class="e1p-note">24 Sep 2026</span></li></ul><div style="margin-top:10px">' + c.button('All updates', { size: 'sm', kind: 'ghost', href: '#/trust?tab=updates', iconRight: 'arrow-right' }) + '</div>' }) + '</div></div>';
      } else if (tab === 'evidence') {
        body = c.table({ caption: 'Evidence documents', columns: [
          { key: 't', label: 'Document', render: function (r) { return esc(r.t) + '<div class="e1p-note">' + esc(r.note) + '</div>'; } },
          { key: 'L', label: 'Level', render: function (r) { return c.level(r.L); } },
          { key: 'upd', label: 'Updated', render: function (r) { return r.upd ? esc(fmt.date(r.upd)) : '<span class="e1-muted">—</span>'; } },
          { key: 'acc', label: 'Access', html: true, render: function (r) {
            if (!E1.atLeast(r.L)) return '<span class="e1p-note">' + c.icon('lock', 12) + ' Arrives at ' + esc(lvlName(r.L)) + '</span>';
            return r.acc === 'public' ? c.button('View', { size: 'sm', icon: 'eye', attrs: 'data-action="p-trust-refusals"' }) : c.button('Request access', { size: 'sm', icon: 'key', attrs: 'data-action="p-trust-request" data-value="' + esc(r.t) + '"' });
          } }
        ], rows: DOCS }) + '<p class="e1p-note" style="margin-top:12px">Access we grant is read-only and time-boxed, through the auditor portal, and every view is recorded in our chain. We never send payloads, salts or key material.</p>';
      } else if (tab === 'controls') {
        var ev = CONTROLS.filter(function (x) { return x[2]; }).length;
        body = '<p class="e1p-note" style="margin:0 0 12px">' + ev + ' of ' + CONTROLS.length + ' controls evidenced. A control without dated evidence reads “not evidenced” — it is never ticked on trust.</p>' +
          c.table({ caption: 'Security baseline', columns: [
            { key: 0, label: 'Control', render: function (r) { return '<strong>' + esc(r[0]) + '</strong><div class="e1p-note">' + esc(r[1]) + '</div>'; } },
            { key: 2, label: 'Status', render: function (r) { return r[2] ? c.badge('good', 'Evidenced') : c.badge('neutral', 'Not evidenced'); } },
            { key: 3, label: 'Evidence', render: function (r) { return esc(r[3]) + (r[2] ? '<div class="e1p-note">' + esc(fmt.date(r[2])) + '</div>' : ''); } }
          ], rows: CONTROLS });
      } else if (tab === 'subprocessors') {
        body = c.table({ caption: 'Subprocessors', columns: [
          { key: 'n', label: 'Subprocessor' }, { key: 'w', label: 'What they process' }, { key: 'r', label: 'Region' }, { key: 'c', label: 'Contract' }, { key: 'd', label: 'Added', nowrap: true }
        ], rows: [
          { n: 'elan1', w: 'The governed write path: gates, approvals, proof records, meter', r: 'ap-south-1 (Mumbai)', c: 'DPA signed 28 Aug 2026', d: fmt.date('2026-08-28') },
          { n: 'rung1 (hosted ERPNext)', w: 'Our books of account at kaveri.rung1.in', r: 'ap-south-1 (Mumbai)', c: 'Service agreement', d: fmt.date('2026-08-20') },
          { n: 'Amazon Web Services', w: 'Infrastructure for both, via elan1 and rung1', r: 'ap-south-1 (Mumbai)', c: 'Through elan1\'s DPA', d: fmt.date('2026-08-28') },
          { n: 'Model provider for agent proposals', w: 'Drafts write intents at rung 4 only — never an allow', r: 'Mumbai [unverified]', c: 'Through elan1\'s DPA', d: fmt.date('2026-08-28') }
        ] }) + '<p class="e1p-note" style="margin-top:12px">We give notice before adding any subprocessor. elan1 publishes its own list at <a href="#/security/subprocessors">elan1 subprocessors</a>.</p>';
      } else if (tab === 'updates') {
        body = c.timeline([
          { time: '24 Sep 2026, 15:10 IST', title: 'Platform failure on one payment entry — our provider\'s failure, not a rule', body: 'ERPNext did not answer for UTR 426817 (₹75,000). Nothing was changed, nothing was billed, and elan1 was paged. Recorded at #4,102.', state: 'serious' },
          { time: '24 Sep 2026, 09:40 IST', title: 'Declaration erp.ar v8 submitted for certification', body: 'Adds invoice cancellation, declared irreversible. Not in force until certified by someone other than its author.', state: 'neutral' },
          { time: '22 Sep 2026', title: 'Auditor access granted to Iyer Menon & Co.', body: 'Read-only, 30 days, approved by two people.', state: 'neutral' },
          { time: '19 Sep 2026', title: 'Declaration erp.ar v7 certified', body: 'Certified by Arjun Mehta.', state: 'good' },
          { time: '1 Sep 2026', title: 'Went live on elan1 at Level 1 Guarded', body: 'First governed write in production; genesis record #1.', state: 'good' }
        ]);
      } else {
        var faq = [
          ['Can I verify your records myself?', L === 'L1' ? 'Not yet without trusting elan1. At Level 1 our records are hash-chained, not signed. Your auditor can reconcile them against ERPNext\'s own audit trail; offline verification arrives at Level 2.' : 'Yes. Ask us for a bundle over any range, get our key fingerprint from our signed notice, and run the free verifier offline.'],
          ['Do software agents change our shared records directly?', 'Only through the governed write path, only for declared write types, and only within their autonomy level. Changes above ₹2 lakh, and every cancellation, need a named person.'],
          ['What happens when an agent is refused?', 'Nothing changes. The refusal is recorded in full with the rule that refused it, and is metered at ₹0.'],
          ['Is any of this approved by a regulator?', 'No. No regulator has reviewed or approved this system or elan1.'],
          ['Where is the data?', 'In India: ap-south-1 (Mumbai). No second region.'],
          ['Can the vendor sign records on our behalf?', 'At Level 1 nothing is signed. From Level 2, only the chain writer can invoke the signing key, and no single human can cause a signature.']
        ];
        body = '<div class="e1-stack">' + faq.map(function (x) { return '<details class="e1p-panel"><summary style="cursor:pointer;font-weight:var(--weight-semibold);color:var(--text-primary)">' + esc(x[0]) + '</summary><p style="margin-top:10px">' + esc(x[1]) + '</p></details>'; }).join('') + '</div>';
      }
      return wrap(trustBand(tab, states), head + body);
    }
  });
  E1.action('p-trust-refusals', function () {
    E1.drawer({ title: 'Refusal summary — last 30 days', eyebrow: 'Public', body: c.table({ caption: 'Refusals by code', dense: true, columns: [{ key: 'c', label: 'Code', mono: true }, { key: 'n', label: 'Count', align: 'right', mono: true }, { key: 'm', label: 'Meter' }], rows: [
      { c: 'GATE.PRECONDITION_FAILED', n: '97', m: '₹0' }, { c: 'GATE.COUNTERPARTY_UNKNOWN', n: '31', m: '₹0' }, { c: 'POLICY.AUTONOMY_INSUFFICIENT', n: '18', m: '₹0' }, { c: 'GATE.BUDGET_EXHAUSTED', n: '12', m: '₹0' }, { c: 'GATE.DUAL_CONTROL_SAME_ACTOR', n: '9', m: '₹0' }, { c: 'Other', n: '4', m: '₹0' }
    ] }) + '<p class="e1p-note" style="margin-top:10px">A refusal is a correct outcome. A lower refusal rate is not a better one.</p>' });
  });
  E1.action('p-trust-request', function (el) {
    var doc = el.getAttribute('data-value') || '';
    E1.modal({ title: 'Request access to evidence', eyebrow: 'Kaveri Spinning Mills decides · read-only · time-boxed', body: '<div class="e1-stack">' +
      '<div class="e1p-grid e1p-grid--2">' + c.field('Your name', c.input({ id: 'p-tn', describedBy: 'p-tn-msg' }), { id: 'p-tn', required: true }) + c.field('Organisation', c.input({ id: 'p-to', describedBy: 'p-to-msg' }), { id: 'p-to', required: true }) + '</div>' +
      c.field('Work e-mail', c.input({ id: 'p-te', type: 'email', describedBy: 'p-te-msg' }), { id: 'p-te', required: true }) +
      c.field('Document', c.select({ id: 'p-td', options: DOCS.filter(function (d) { return E1.atLeast(d.L); }).map(function (d) { return d.t; }), value: doc }), { id: 'p-td' }) +
      c.field('Purpose', c.textarea({ id: 'p-tp', rows: 3, describedBy: 'p-tp-msg' }), { id: 'p-tp', required: true, help: 'At least 12 characters — for example, the audit or diligence it is for.' }) +
      c.checkbox({ id: 'p-tc', label: 'I understand access is read-only and time-boxed, and every view is recorded in Kaveri\'s chain.' }) + '</div>',
      actions: [{ label: 'Cancel', kind: 'ghost' }, { label: 'Send request', kind: 'primary', onClick: function (e, close, root) {
        var ok = true;
        [['#p-tn', 2, 'Enter your name.'], ['#p-to', 2, 'Enter your organisation.'], ['#p-tp', 12, 'Write at least 12 characters about the purpose.']].forEach(function (x) { var i = sel(x[0], root); if (ok && String(i.value).trim().length < x[1]) { showFieldError(i, x[2]); ok = false; } });
        var em = sel('#p-te', root); if (ok && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(String(em.value).trim())) { showFieldError(em, 'Enter a work e-mail address.'); ok = false; }
        if (ok && !sel('#p-tc', root).checked) { E1.toast('Tick the acknowledgement to send the request.', 'warning'); ok = false; }
        if (!ok) return false;
        close(); E1.toast('Meenakshi Iyer decides. If granted, access arrives through the auditor portal, read-only and time-boxed.', 'good', { title: 'Request sent to Kaveri Spinning Mills' });
      } }] });
  });
})();
