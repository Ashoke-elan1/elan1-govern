/* ==========================================================================
   elan1 — public website (owner: site · layout 'public')
   Every route under "PUBLIC WEBSITE" in ROUTES.md.
   Sources: research/spec-im.md §1, 3–8 · spec-phase4-group.md · spec-phase1-console.md §1, §6 ·
   spec-phase2-3-evidence.md (seal, bundle, verifier) · competitors-1/2 · Brand Book v1.0 (messaging).
   Page-level styles are injected once below (prefix .e1s-); colours are tokens only.
   ========================================================================== */
(function () {
  'use strict';
  var c = E1.c, esc = E1.esc, fmt = E1.fmt;

  /* ------------------------------------------------------------------------
     Styles (token-only). core/components have no marketing layout classes, so
     the public site carries its own, scoped under .e1s-.
     ------------------------------------------------------------------------ */
  var CSS = [
    '.e1s-wrap{max-width:var(--content-wide);margin:0 auto;padding:0 32px}',
    '.e1s-wrap--narrow{max-width:calc(var(--content-max) + 64px)}',
    '.e1s-band{padding:72px 0;border-top:1px solid var(--border-subtle)}',
    '.e1s-band--tight{padding:56px 0}',
    '.e1s-band--sunken{background:var(--bg-sunken)}',
    '.e1s-band--surface{background:var(--bg-surface)}',
    '.e1s-band--ink{background:var(--bg-chrome);color:var(--text-on-chrome);border-top:0}',
    '.e1s-band--ink .e1s-h2,.e1s-band--ink .e1s-h3{color:var(--text-on-chrome-strong)}',
    '.e1s-band--ink .e1s-lead,.e1s-band--ink .e1s-muted{color:var(--text-on-chrome-quiet)}',
    '.e1s-band--ink .e1s-eyebrow{color:var(--brand-ember)}',
    '.e1s-band--ink a:not(.e1-btn):not(.e1s-btn){color:var(--brand-ember)}',
    '.e1s-head{display:flex;justify-content:space-between;align-items:flex-end;gap:24px;flex-wrap:wrap;margin-bottom:40px}',
    '.e1s-head__t{max-width:780px;min-width:0}',
    '.e1s-head__a{display:flex;gap:8px;flex-wrap:wrap}',
    '.e1s-eyebrow{font:var(--weight-semibold) var(--text-label)/var(--lh-label) var(--font-ui);letter-spacing:var(--tracking-label);text-transform:uppercase;color:var(--text-accent);margin:0 0 12px}',
    '.e1s-h2{font:var(--weight-title) 32px/38px var(--font-display);letter-spacing:var(--tracking-display);margin:0;text-wrap:balance}',
    '.e1s-h3{font:var(--weight-semibold) var(--text-section)/var(--lh-section) var(--font-display);letter-spacing:var(--tracking-title);margin:0}',
    '.e1s-h4{font:var(--weight-semibold) var(--text-lead)/var(--lh-lead) var(--font-display);margin:0}',
    '.e1s-lead{margin:12px 0 0;font-size:17px;line-height:26px;font-weight:var(--weight-regular);color:var(--text-secondary);max-width:66ch}',
    '.e1s-p{margin:0;color:var(--text-secondary);font-size:var(--text-body);line-height:22px;max-width:70ch}',
    '.e1s-p + .e1s-p{margin-top:10px}',
    '.e1s-muted{color:var(--text-secondary)}',
    '.e1s-mono{font-family:var(--font-mono);font-variant-numeric:tabular-nums}',
    '.e1s-src{margin-top:16px;font-size:var(--text-caption);line-height:var(--lh-caption);color:var(--text-tertiary)}',
    '.e1s-band--ink .e1s-src{color:var(--text-on-chrome-quiet)}',
    '.e1s-stack>*+*{margin-top:16px}',
    '.e1s-stack--lg>*+*{margin-top:32px}',
    '.e1s-grid{display:grid;gap:16px;grid-template-columns:repeat(auto-fit,minmax(260px,1fr))}',
    '.e1s-grid--2{grid-template-columns:repeat(2,minmax(0,1fr))}',
    '.e1s-grid--3{grid-template-columns:repeat(3,minmax(0,1fr))}',
    '.e1s-grid--4{grid-template-columns:repeat(4,minmax(0,1fr))}',
    '.e1s-split{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:48px;align-items:start}',
    '.e1s-split--wide{grid-template-columns:minmax(0,1.35fr) minmax(0,1fr)}',
    '.e1s-split--side{grid-template-columns:minmax(0,1fr) 340px}',
    '.e1s-sticky{position:sticky;top:88px}',
    /* cards */
    '.e1s-card{display:flex;flex-direction:column;gap:10px;background:var(--bg-surface);border:1px solid var(--border-subtle);border-radius:var(--radius-md);padding:24px;min-width:0;color:var(--text-primary);text-decoration:none;position:relative}',
    'a.e1s-card{transition:border-color var(--dur-fast) var(--ease-out),box-shadow var(--dur-fast) var(--ease-out)}',
    'a.e1s-card:hover{border-color:var(--border-default);box-shadow:var(--shadow-2)}',
    '.e1s-card__top{display:flex;align-items:center;justify-content:space-between;gap:8px;color:var(--text-secondary)}',
    '.e1s-card__k{font:var(--weight-semibold) 12px/1 var(--font-mono);color:var(--text-accent);letter-spacing:.02em}',
    '.e1s-card__d{font-size:var(--text-body);line-height:21px;color:var(--text-secondary);margin:0}',
    '.e1s-card__foot{margin-top:auto;padding-top:12px;display:flex;align-items:center;gap:6px;font-size:var(--text-caption);font-weight:var(--weight-semibold);color:var(--text-link)}',
    '.e1s-card--flat{box-shadow:none;background:transparent}',
    '.e1s-card--accent{border-color:var(--border-accent);box-shadow:inset 3px 0 0 var(--border-accent)}',
    '.e1s-list{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:8px}',
    '.e1s-list li{display:grid;grid-template-columns:16px minmax(0,1fr);gap:8px;font-size:var(--text-body);line-height:20px;color:var(--text-secondary)}',
    '.e1s-list li>svg{margin-top:2px;color:var(--text-tertiary)}',
    '.e1s-list--tight li{font-size:var(--text-caption);line-height:18px}',
    '.e1s-band--ink .e1s-list li{color:var(--text-on-chrome-quiet)}',
    /* page hero (inner pages) */
    '.e1s-phero{padding:48px 0 40px;border-bottom:1px solid var(--border-subtle)}',
    '.e1s-crumbs{display:flex;flex-wrap:wrap;gap:6px;align-items:center;font-size:var(--text-caption);color:var(--text-tertiary);margin:0 0 20px;padding:0;list-style:none}',
    '.e1s-crumbs a{color:var(--text-secondary);text-decoration:none}.e1s-crumbs a:hover{color:var(--text-primary);text-decoration:underline}',
    '.e1s-phero__grid{display:grid;grid-template-columns:minmax(0,1.45fr) minmax(0,1fr);gap:56px;align-items:end}',
    '.e1s-phero__grid--solo{grid-template-columns:minmax(0,1fr)}',
    '.e1s-h1{font:var(--weight-title) 44px/1.08 var(--font-display);letter-spacing:var(--tracking-display);margin:0;max-width:22ch;text-wrap:balance}',
    '.e1s-phero__lead{margin:16px 0 0;font-size:18px;line-height:28px;font-weight:var(--weight-regular);color:var(--text-secondary);max-width:60ch}',
    '.e1s-phero__actions{display:flex;gap:10px;flex-wrap:wrap;margin-top:28px;align-items:center}',
    '.e1s-phero__meta{display:flex;gap:8px 16px;flex-wrap:wrap;margin-top:20px;font-size:var(--text-caption);color:var(--text-secondary);align-items:center}',
    '.e1s-toc{display:flex;flex-wrap:wrap;gap:6px 18px;margin:28px 0 0;padding:14px 0 0;border-top:1px solid var(--border-subtle);list-style:none;font-size:var(--text-caption)}',
    '.e1s-toc li{display:flex;gap:6px;align-items:baseline}.e1s-toc span{font-family:var(--font-mono);color:var(--text-tertiary)}',
    '.e1s-toc a{color:var(--text-secondary);text-decoration:none;font-weight:var(--weight-medium)}.e1s-toc a:hover{color:var(--text-primary);text-decoration:underline}',
    /* provenance and small chips */
    '.e1s-prov{display:inline-flex;align-items:center;gap:4px;height:18px;padding:0 6px;border:1px solid var(--border-default);border-radius:var(--radius-sm);font:var(--weight-semibold) 10px/1 var(--font-mono);letter-spacing:.06em;color:var(--text-secondary);vertical-align:middle;white-space:nowrap}',
    '.e1s-prov--modelled{border-style:dashed}',
    '.e1s-band--ink .e1s-prov{border-color:var(--ink-500);color:var(--text-on-chrome-quiet)}',
    '.e1s-tag{display:inline-flex;align-items:center;gap:6px;font:var(--weight-semibold) 11px/1 var(--font-mono);letter-spacing:.04em;color:var(--text-secondary);background:var(--bg-sunken);border:1px solid var(--border-subtle);border-radius:var(--radius-sm);padding:4px 7px;white-space:nowrap}',
    '.e1s-code{font-family:var(--font-mono);font-size:.92em;background:var(--bg-sunken);border:1px solid var(--border-subtle);border-radius:var(--radius-sm);padding:1px 5px;white-space:nowrap}',
    '.e1s-band--ink .e1s-code{background:var(--ink-700);border-color:var(--ink-600);color:var(--text-on-chrome)}',
    /* buttons for ink fields (paper on ink; clay is never a status) */
    '.e1s-btn{display:inline-flex;align-items:center;gap:8px;height:var(--control-height-lg);padding:0 16px;border-radius:var(--radius-sm);font:var(--weight-semibold) var(--text-body)/1 var(--font-ui);text-decoration:none;border:1px solid transparent;white-space:nowrap;cursor:pointer}',
    '.e1s-btn--paper{background:var(--brand-paper);color:var(--brand-ink);border-color:var(--brand-paper)}',
    '.e1s-btn--paper:hover{background:var(--brand-bone);border-color:var(--brand-bone)}',
    '.e1s-btn--line{background:transparent;color:var(--text-on-chrome);border-color:var(--ink-400)}',
    '.e1s-btn--line:hover{border-color:var(--text-on-chrome);color:var(--text-on-chrome-strong)}',
    '.e1s-btn--text{background:transparent;color:var(--text-on-chrome);padding:0 6px}',
    '.e1s-btn--text:hover{color:var(--text-on-chrome-strong);text-decoration:underline}',
    '.e1s-btn:focus-visible{outline:none;box-shadow:0 0 0 2px var(--bg-chrome),0 0 0 4px var(--ink-200)}',
    /* home hero — Brand Book cover architecture A (field crop) on the ink field, one disc, one 50° diagonal */
    '.e1s-hero{position:relative;overflow:hidden;background:var(--bg-chrome);color:var(--text-on-chrome);isolation:isolate}',
    '.e1s-hero__disc{position:absolute;z-index:-1;width:min(60vw,880px);aspect-ratio:1/1;border-radius:50%;background:var(--brand-clay);right:calc(min(60vw,880px) * -0.36);top:50%;transform:translateY(-46%)}',
    '.e1s-hero__diag{position:absolute;z-index:-1;left:54%;bottom:-2px;width:1px;height:132%;background:color-mix(in srgb,var(--brand-ember) 70%,transparent);transform-origin:bottom center;transform:rotate(40deg)}',
    '.e1s-hero__in{position:relative;padding:92px 0 40px}',
    '.e1s-hero__text{max-width:720px}',
    '.e1s-hero__kicker{margin:0 0 18px;font:var(--weight-regular) 20px/28px var(--font-display);color:var(--text-on-chrome-quiet);max-width:34ch}',
    '.e1s-hero__h1{margin:0;font:var(--weight-title) 52px/1.06 var(--font-display);letter-spacing:var(--tracking-display);color:var(--text-on-chrome-strong);max-width:17ch;text-wrap:balance}',
    '.e1s-hero__rule{margin:32px 0 0;padding:4px 0 4px 20px;border-left:3px solid var(--brand-clay);max-width:560px}',
    '.e1s-hero__rule p{margin:0;font:var(--weight-semibold) 22px/30px var(--font-display);color:var(--text-on-chrome-strong)}',
    '.e1s-hero__rule small{display:block;margin-top:8px;font-size:var(--text-caption);line-height:18px;color:var(--text-on-chrome-quiet)}',
    '.e1s-hero__cta{display:flex;flex-wrap:wrap;gap:10px;margin-top:36px;align-items:center}',
    '.e1s-hero__strip{display:flex;flex-wrap:wrap;gap:8px 28px;margin-top:72px;padding-top:18px;border-top:1px solid var(--ink-600);font:var(--weight-medium) 12px/16px var(--font-mono);color:var(--text-on-chrome-quiet);max-width:640px}',
    '.e1s-hero__strip b{color:var(--text-on-chrome);font-weight:var(--weight-semibold)}',
    /* stats */
    '.e1s-stats{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));border-top:1px solid var(--border-default)}',
    '.e1s-stat{padding:20px 20px 4px 0}',
    '.e1s-stat+.e1s-stat{padding-left:20px;border-left:1px solid var(--border-subtle)}',
    '.e1s-stat__v{font:var(--weight-title) 38px/1 var(--font-display);letter-spacing:var(--tracking-display);font-variant-numeric:tabular-nums}',
    '.e1s-stat__v small{font-size:20px;letter-spacing:0}',
    '.e1s-stat__l{margin-top:10px;font-size:var(--text-body);line-height:20px;color:var(--text-secondary);max-width:30ch}',
    '.e1s-stat__s{margin-top:8px;font-size:var(--text-caption);color:var(--text-tertiary)}',
    '.e1s-band--ink .e1s-stats{border-color:var(--ink-500)}.e1s-band--ink .e1s-stat+.e1s-stat{border-color:var(--ink-600)}',
    '.e1s-band--ink .e1s-stat__v{color:var(--text-on-chrome-strong)}.e1s-band--ink .e1s-stat__l,.e1s-band--ink .e1s-stat__s{color:var(--text-on-chrome-quiet)}',
    /* quotes */
    '.e1s-quote{margin:0;padding:6px 0 6px 22px;border-left:3px solid var(--border-accent);font:var(--weight-semibold) 26px/34px var(--font-display);letter-spacing:var(--tracking-title);max-width:40ch;text-wrap:balance}',
    '.e1s-quote cite{display:block;margin-top:10px;font:var(--weight-regular) var(--text-caption)/var(--lh-caption) var(--font-ui);color:var(--text-tertiary);font-style:normal;letter-spacing:0}',
    '.e1s-quote--sm{font-size:19px;line-height:27px}',
    /* nine-rung path (home, animated) */
    '.e1s-rp__bar{display:flex;flex-wrap:wrap;gap:12px;align-items:center;justify-content:space-between;margin-bottom:20px}',
    '.e1s-rp__scn{display:inline-flex;border:1px solid var(--border-default);border-radius:var(--radius-sm);overflow:hidden;background:var(--bg-surface)}',
    '.e1s-rp__scn button{height:36px;padding:0 14px;border:0;background:transparent;font:var(--weight-medium) var(--text-body)/1 var(--font-ui);color:var(--text-secondary);cursor:pointer;display:inline-flex;align-items:center;gap:6px}',
    '.e1s-rp__scn button+button{border-left:1px solid var(--border-subtle)}',
    '.e1s-rp__scn button[aria-pressed="true"]{background:var(--text-primary);color:var(--text-inverse)}',
    '.e1s-rp__ctl{display:flex;gap:8px}',
    '.e1s-path{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:repeat(10,minmax(0,1fr));gap:8px;align-items:end}',
    '.e1s-rung{position:relative;display:flex;flex-direction:column;gap:6px;padding:12px 11px 12px;height:148px;overflow:hidden;background:var(--bg-surface);border:1px solid var(--border-subtle);border-radius:var(--radius-md);transition:border-color var(--dur-base) var(--ease-out),box-shadow var(--dur-base) var(--ease-out),opacity var(--dur-base) var(--ease-out),transform var(--dur-slow) var(--ease-entrance)}',
    '.e1s-rung:nth-child(1){margin-bottom:0}.e1s-rung:nth-child(2){margin-bottom:6px}.e1s-rung:nth-child(3){margin-bottom:12px}.e1s-rung:nth-child(4){margin-bottom:18px}.e1s-rung:nth-child(5){margin-bottom:24px}.e1s-rung:nth-child(6){margin-bottom:30px}.e1s-rung:nth-child(7){margin-bottom:36px}.e1s-rung:nth-child(8){margin-bottom:42px}.e1s-rung:nth-child(9){margin-bottom:48px}.e1s-rung:nth-child(10){margin-bottom:54px}',
    '.e1s-rung__n{font:var(--weight-semibold) 11px/1 var(--font-mono);color:var(--text-tertiary);display:flex;justify-content:space-between;align-items:center}',
    '.e1s-rung__name{font:var(--weight-title) 12px/15px var(--font-mono);letter-spacing:.03em;color:var(--text-primary);word-break:break-word}',
    '.e1s-rung__job{font-size:12px;line-height:16px;color:var(--text-secondary)}',
    '.e1s-rung__st{margin-top:auto;padding-top:8px;display:flex;align-items:center;gap:4px;font-size:11px;line-height:14px;font-weight:var(--weight-semibold);color:var(--text-tertiary)}',
    '.e1s-rung--kernel{box-shadow:inset 0 3px 0 var(--zone-kernel)}',
    '.e1s-rung.is-wait{opacity:.55}',
    '.e1s-rung.is-now{border-color:var(--border-accent);box-shadow:0 0 0 3px color-mix(in srgb,var(--brand-clay) 22%,transparent);opacity:1;transform:translateY(-4px)}',
    '.e1s-rung.is-pass{border-color:var(--border-default)}.e1s-rung.is-pass .e1s-rung__st{color:var(--state-good)}',
    '.e1s-rung.is-fail{border-color:var(--state-neutral);background:var(--state-neutral-bg)}.e1s-rung.is-fail .e1s-rung__st{color:var(--state-neutral)}',
    '.e1s-rung.is-esc{border-color:var(--state-warning-accent);background:var(--state-warning-bg)}.e1s-rung.is-esc .e1s-rung__st{color:var(--state-warning)}',
    '.e1s-rung.is-skip{opacity:.5;border-style:dashed}',
    '.e1s-rung.is-rec .e1s-rung__st{color:var(--text-primary)}',
    '.e1s-rp__out{margin-top:20px;display:grid;grid-template-columns:minmax(0,1.3fr) minmax(0,1fr);gap:16px}',
    '.e1s-log{margin:0;padding:16px 18px;background:var(--bg-chrome);color:var(--text-on-chrome);border-radius:var(--radius-md);font:12px/20px var(--font-mono);min-height:236px;overflow:auto;list-style:none}',
    '.e1s-log li{display:grid;grid-template-columns:34px 112px minmax(0,1fr);gap:8px;white-space:normal}',
    '.e1s-log .k{color:var(--text-on-chrome-quiet)}.e1s-log .v{color:var(--text-on-chrome)}.e1s-log .ok{color:var(--toast-good)}.e1s-log .no{color:var(--ink-200)}.e1s-log .esc{color:var(--toast-warning)}',
    '.e1s-log li.is-new{animation:e1s-in var(--dur-slow) var(--ease-entrance)}',
    '@keyframes e1s-in{from{opacity:0;transform:translateX(-4px)}to{opacity:1;transform:none}}',
    /* product window (live-looking preview built from real components) */
    '.e1s-window{border:1px solid var(--border-default);border-radius:var(--radius-lg);background:var(--bg-canvas);box-shadow:var(--shadow-4);overflow:hidden;min-width:0}',
    '.e1s-window__bar{display:flex;align-items:center;gap:10px;padding:9px 14px;background:var(--bg-chrome);color:var(--text-on-chrome-quiet);font:var(--weight-medium) 12px/16px var(--font-mono)}',
    '.e1s-window__bar b{color:var(--text-on-chrome);font-weight:var(--weight-semibold)}',
    '.e1s-window__bar .e1s-sample{margin-left:auto;color:var(--chrome-sandbox-fg);border:1px solid var(--chrome-sandbox-border);background:var(--chrome-sandbox-bg);border-radius:var(--radius-sm);padding:2px 6px;font-size:10px;letter-spacing:.06em;text-transform:uppercase}',
    '.e1s-window__body{padding:20px;display:grid;grid-template-columns:minmax(0,1.25fr) minmax(0,1fr);gap:16px;align-items:start}',
    '.e1s-window__body--one{grid-template-columns:minmax(0,1fr)}',
    /* door cards */
    '.e1s-door{display:flex;flex-direction:column;gap:12px}',
    '.e1s-door__ic{width:40px;height:40px;border-radius:var(--radius-md);display:grid;place-items:center;background:var(--bg-chrome);color:var(--text-on-chrome)}',
    '.e1s-door__q{font:var(--weight-regular) var(--text-lead)/var(--lh-lead) var(--font-display);color:var(--text-primary)}',
    /* level cards */
    '.e1s-lvl{display:flex;flex-direction:column;gap:14px}',
    '.e1s-lvl__claim{font:var(--weight-semibold) 22px/28px var(--font-display);letter-spacing:var(--tracking-title);margin:0}',
    '.e1s-lvl__gate{display:flex;gap:8px;align-items:flex-start;padding:12px 14px;border:1px dashed var(--border-default);border-radius:var(--radius-md);font-size:var(--text-caption);line-height:18px;color:var(--text-secondary)}',
    '.e1s-lvl__gate b{color:var(--text-primary)}',
    '.e1s-lvl__price{font:var(--weight-semibold) var(--text-body)/1.4 var(--font-mono);color:var(--text-primary)}',
    /* invoice snippet */
    '.e1s-inv{border:1px solid var(--border-subtle);border-radius:var(--radius-md);background:var(--bg-surface);overflow:hidden}',
    '.e1s-inv__h{display:flex;justify-content:space-between;gap:8px;padding:14px 18px;border-bottom:1px solid var(--border-subtle);font-size:var(--text-caption);color:var(--text-secondary);flex-wrap:wrap}',
    '.e1s-inv table{width:100%;border-collapse:collapse;font-size:var(--text-body)}',
    '.e1s-inv th,.e1s-inv td{padding:10px 18px;border-bottom:1px solid var(--border-subtle);text-align:left;font-weight:var(--weight-regular)}',
    '.e1s-inv td{text-align:right;font-family:var(--font-mono);font-variant-numeric:tabular-nums;white-space:nowrap}',
    '.e1s-inv tr.is-zero th,.e1s-inv tr.is-zero td{background:var(--bg-sunken)}',
    '.e1s-inv tr.is-zero td{font-weight:var(--weight-semibold)}',
    '.e1s-inv tr.is-total th,.e1s-inv tr.is-total td{font-weight:var(--weight-bold);border-bottom:0;border-top:2px solid var(--border-strong)}',
    '.e1s-inv small{display:block;color:var(--text-tertiary);font-size:var(--text-caption);font-family:var(--font-ui)}',
    /* honesty ledger */
    '.e1s-caps{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:0 32px}',
    '.e1s-cap{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:12px;align-items:center;padding:12px 0;border-bottom:1px solid var(--border-subtle);font-size:var(--text-body)}',
    '.e1s-cap small{display:block;color:var(--text-tertiary);font-size:var(--text-caption);margin-top:2px}',
    '.e1s-band--ink .e1s-cap{border-color:var(--ink-600)}.e1s-band--ink .e1s-cap small{color:var(--text-on-chrome-quiet)}',
    '.e1s-status{display:inline-flex;align-items:center;gap:6px;font:var(--weight-semibold) 11px/1.3 var(--font-mono);letter-spacing:.04em;text-transform:uppercase;padding:4px 8px;border-radius:var(--radius-sm);border:1px solid var(--border-default);color:var(--text-secondary);white-space:nowrap;max-width:100%}',
    '.e1s-status i{flex:none}',
    '.e1s-status i{width:8px;height:8px;border-radius:50%;border:1.5px solid currentColor;display:inline-block}',
    '.e1s-status--building i{background:linear-gradient(90deg,currentColor 50%,transparent 50%)}',
    '.e1s-status--ga i{background:currentColor}',
    '.e1s-status--spec{border-style:dashed}',
    '.e1s-status--notbuilt{opacity:.8}',
    '.e1s-band--ink .e1s-status{border-color:var(--ink-500);color:var(--text-on-chrome)}',
    /* matrix */
    '.e1s-matrix th[scope="row"]{white-space:normal}',
    '.e1s-matrix tr.is-self th,.e1s-matrix tr.is-self td{background:var(--bg-selected)}',
    '.e1s-matrix tr.is-self th{box-shadow:inset 3px 0 0 var(--border-accent)}',
    '.e1s-cell{display:flex;flex-direction:column;gap:4px;align-items:flex-start}',
    '.e1s-cell small{font-size:11px;line-height:14px;color:var(--text-tertiary);max-width:26ch}',
    '.e1s-map{position:relative;display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);grid-template-rows:auto auto;gap:1px;background:var(--border-default);border:1px solid var(--border-default);border-radius:var(--radius-md);overflow:hidden}',
    '.e1s-map__q{background:var(--bg-surface);padding:18px 20px 20px;min-height:170px;display:flex;flex-direction:column;gap:10px}',
    '.e1s-map__q h3{margin:0;font:var(--weight-semibold) 13px/18px var(--font-ui);color:var(--text-secondary);letter-spacing:.02em}',
    '.e1s-map__q--empty{background:var(--bg-canvas);background-image:repeating-linear-gradient(140deg,transparent 0 11px,var(--border-subtle) 11px 12px)}',
    '.e1s-map__names{display:flex;flex-wrap:wrap;gap:6px}',
    '.e1s-hollow{display:inline-flex;align-items:center;gap:8px;font-size:var(--text-caption);font-weight:var(--weight-semibold);color:var(--text-primary);background:var(--bg-surface);padding:6px 10px;border:1px dashed var(--border-accent);border-radius:var(--radius-full)}',
    '.e1s-hollow i{width:12px;height:12px;border-radius:50%;border:2px solid var(--border-accent)}',
    '.e1s-axis{font:var(--weight-semibold) 10px/1 var(--font-mono);letter-spacing:.08em;text-transform:uppercase;color:var(--text-tertiary);display:flex;justify-content:space-between;margin-top:8px}',
    /* diagram (zones are diagram-only colours) */
    '.e1s-dia{display:grid;grid-template-columns:minmax(0,1fr) 32px minmax(0,1.6fr) 32px minmax(0,1fr);align-items:stretch;gap:0}',
    '.e1s-dia__col{display:flex;flex-direction:column;gap:8px}',
    '.e1s-dia__arrow{display:grid;place-items:center;color:var(--text-tertiary)}',
    '.e1s-zone{border:1px solid var(--zone-c,var(--border-default));background:var(--zone-bg,var(--bg-surface));border-radius:var(--radius-md);padding:12px 14px;color:var(--text-primary)}',
    '.e1s-zone__l{font:var(--weight-semibold) 10px/1.2 var(--font-mono);letter-spacing:.08em;text-transform:uppercase;color:var(--zone-c,var(--text-secondary));margin:0 0 6px}',
    '.e1s-zone__t{font:var(--weight-semibold) var(--text-body)/1.35 var(--font-ui);margin:0}',
    '.e1s-zone__d{font-size:12px;line-height:16px;color:var(--text-secondary);margin:4px 0 0}',
    '.e1s-z-consumer{--zone-c:var(--zone-consumer);--zone-bg:var(--zone-consumer-bg)}',
    '.e1s-z-kernel{--zone-c:var(--zone-kernel);--zone-bg:var(--zone-kernel-bg)}',
    '.e1s-z-people{--zone-c:var(--zone-people);--zone-bg:var(--zone-people-bg)}',
    '.e1s-z-external{--zone-c:var(--zone-external);--zone-bg:var(--zone-external-bg)}',
    '.e1s-z-runtime{--zone-c:var(--zone-runtime);--zone-bg:var(--zone-runtime-bg)}',
    '.e1s-z-refusal{--zone-c:var(--zone-refusal);--zone-bg:var(--zone-refusal-bg)}',
    '.e1s-dia__rungs{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:4px;margin-top:8px}',
    '.e1s-dia__rungs span{font:var(--weight-semibold) 10px/1.2 var(--font-mono);padding:6px 4px;text-align:center;border-radius:var(--radius-sm);background:var(--bg-surface);border:1px solid var(--zone-kernel);color:var(--zone-kernel)}',
    /* forms */
    '.e1s-form{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px 16px}',
    '.e1s-form .is-full{grid-column:1/-1}',
    '.e1s-form__actions{grid-column:1/-1;display:flex;gap:12px;align-items:center;flex-wrap:wrap;margin-top:8px}',
    '.e1s-formcard{background:var(--bg-surface);border:1px solid var(--border-subtle);border-radius:var(--radius-lg);padding:28px;box-shadow:var(--shadow-2)}',
    /* calculator */
    '.e1s-calc{display:grid;grid-template-columns:minmax(0,1.2fr) minmax(0,1fr);gap:32px;align-items:start}',
    '.e1s-ctl{padding:18px 0;border-bottom:1px solid var(--border-subtle)}',
    '.e1s-ctl:first-child{padding-top:0}',
    '.e1s-ctl__row{display:flex;justify-content:space-between;align-items:baseline;gap:12px;margin-bottom:10px;flex-wrap:wrap}',
    '.e1s-ctl__row label,.e1s-ctl__row .e1s-lbl{font-weight:var(--weight-semibold);font-size:var(--text-body)}',
    '.e1s-ctl__val{font:var(--weight-semibold) var(--text-lead)/1 var(--font-mono);font-variant-numeric:tabular-nums}',
    '.e1s-ctl__help{margin-top:8px;font-size:var(--text-caption);line-height:var(--lh-caption);color:var(--text-tertiary)}',
    '.e1s-range{width:100%;accent-color:var(--brand-clay);height:28px;margin:0}',
    '.e1s-range:focus-visible{outline:none;box-shadow:var(--focus-shadow);border-radius:var(--radius-sm)}',
    '.e1s-total{font:var(--weight-title) 44px/1 var(--font-display);letter-spacing:var(--tracking-display);font-variant-numeric:tabular-nums;margin:6px 0 4px}',
    '.e1s-presets{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:24px}',
    '.e1s-presets button{height:32px;padding:0 12px;border-radius:var(--radius-full);border:1px solid var(--border-default);background:var(--bg-surface);font:var(--weight-medium) var(--text-caption)/1 var(--font-ui);color:var(--text-primary);cursor:pointer}',
    '.e1s-presets button[aria-pressed="true"]{background:var(--text-primary);color:var(--text-inverse);border-color:var(--text-primary)}',
    '.e1s-presets button:hover{border-color:var(--text-primary)}',
    /* status */
    '.e1s-sys{display:flex;align-items:center;gap:14px;padding:18px 22px;border:1px solid var(--state-good-border);background:var(--state-good-bg);border-radius:var(--radius-md);font:var(--weight-semibold) var(--text-section)/1.3 var(--font-display)}',
    '.e1s-sys--warning{border-color:var(--state-warning-border);background:var(--state-warning-bg)}',
    '.e1s-sys--critical{border-color:var(--state-critical-border);background:var(--state-critical-bg)}',
    '.e1s-sys small{display:block;font:var(--weight-regular) var(--text-caption)/1.4 var(--font-ui);color:var(--text-secondary);margin-top:2px}',
    '.e1s-comp{padding:18px 0;border-bottom:1px solid var(--border-subtle)}',
    '.e1s-comp__h{display:flex;justify-content:space-between;align-items:flex-start;gap:12px;flex-wrap:wrap}',
    '.e1s-comp__n{font-weight:var(--weight-semibold)}',
    '.e1s-comp__d{font-size:var(--text-caption);color:var(--text-secondary);margin-top:2px;max-width:70ch}',
    '.e1s-up{display:flex;gap:2px;margin-top:12px;height:30px;align-items:stretch}',
    '.e1s-up i{flex:1;min-width:2px;border-radius:1px;background:var(--state-good)}',
    '.e1s-up i.is-warning{background:var(--state-warning-accent)}.e1s-up i.is-serious{background:var(--state-serious)}.e1s-up i.is-critical{background:var(--state-critical)}.e1s-up i.is-none{background:var(--border-subtle)}',
    '.e1s-up i.is-warning,.e1s-up i.is-serious,.e1s-up i.is-critical{height:100%;box-shadow:inset 0 -6px 0 var(--bg-surface)}',
    '.e1s-up__axis{display:flex;justify-content:space-between;font-size:11px;color:var(--text-tertiary);margin-top:6px}',
    /* glossary */
    '.e1s-az{display:flex;flex-wrap:wrap;gap:4px;margin:16px 0 0}',
    '.e1s-az a,.e1s-az span{width:32px;height:32px;display:grid;place-items:center;border-radius:var(--radius-sm);font:var(--weight-semibold) 13px/1 var(--font-mono);text-decoration:none;color:var(--text-primary);border:1px solid var(--border-subtle);background:var(--bg-surface)}',
    '.e1s-az span{color:var(--text-disabled);background:transparent}',
    '.e1s-az a:hover{border-color:var(--text-primary)}',
    '.e1s-gl__letter{font:var(--weight-title) 28px/1 var(--font-display);color:var(--text-accent);padding:28px 0 8px;border-bottom:1px solid var(--border-default);margin:0}',
    '.e1s-gl__item{display:grid;grid-template-columns:260px minmax(0,1fr);gap:24px;padding:16px 0;border-bottom:1px solid var(--border-subtle);margin:0}',
    '.e1s-gl__item dt{font:var(--weight-semibold) var(--text-lead)/1.35 var(--font-display)}',
    '.e1s-gl__item dt small{display:block;margin-top:4px;font:var(--weight-regular) 11px/1.3 var(--font-mono);color:var(--text-tertiary)}',
    '.e1s-gl__item dd{margin:0;color:var(--text-secondary);line-height:22px}',
    '.e1s-gl__see{margin-top:6px;font-size:var(--text-caption)}',
    /* legal & prose */
    '.e1s-prose{max-width:72ch}',
    '.e1s-prose h2{font:var(--weight-title) 24px/30px var(--font-display);letter-spacing:var(--tracking-title);margin:40px 0 12px;scroll-margin-top:88px}',
    '.e1s-prose h3{font:var(--weight-semibold) var(--text-section)/var(--lh-section) var(--font-display);margin:24px 0 8px}',
    '.e1s-prose p,.e1s-prose li{color:var(--text-secondary);line-height:24px;font-size:15px}',
    '.e1s-prose p{margin:0 0 12px}.e1s-prose ul,.e1s-prose ol{margin:0 0 12px;padding-left:20px}.e1s-prose li+li{margin-top:6px}',
    '.e1s-prose strong{color:var(--text-primary)}',
    /* steps */
    '.e1s-steps{list-style:none;margin:0;padding:0;counter-reset:st;display:grid;gap:0}',
    '.e1s-steps li{counter-increment:st;display:grid;grid-template-columns:40px minmax(0,1fr);gap:14px;padding:14px 0;border-bottom:1px solid var(--border-subtle)}',
    '.e1s-steps li::before{content:counter(st);width:28px;height:28px;border-radius:50%;border:1.5px solid var(--border-default);display:grid;place-items:center;font:var(--weight-semibold) 12px/1 var(--font-mono);color:var(--text-secondary)}',
    '.e1s-steps li>div{padding-top:4px}',
    '.e1s-steps b{display:block;font-weight:var(--weight-semibold);color:var(--text-primary)}',
    '.e1s-steps span{font-size:var(--text-caption);line-height:18px;color:var(--text-secondary)}',
    /* gate ladder (roadmap) */
    '.e1s-gates{list-style:none;margin:0;padding:0;display:grid;gap:0;position:relative}',
    '.e1s-gatei{display:grid;grid-template-columns:72px minmax(0,1fr) minmax(0,1fr) 170px;gap:24px;padding:22px 0;border-bottom:1px solid var(--border-subtle);align-items:start}',
    '.e1s-gatei__id{font:var(--weight-title) 28px/1 var(--font-display);color:var(--text-accent)}',
    '.e1s-gatei__lbl{font:var(--weight-semibold) 10px/1 var(--font-mono);letter-spacing:.08em;text-transform:uppercase;color:var(--text-tertiary);margin-bottom:6px}',
    /* people & roles */
    '.e1s-role{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:16px;align-items:center;padding:18px 0;border-bottom:1px solid var(--border-subtle)}',
    '.e1s-note{display:flex;gap:10px;align-items:flex-start;padding:12px 16px;border-radius:var(--radius-md);background:var(--bg-sunken);border:1px solid var(--border-subtle);font-size:var(--text-caption);line-height:18px;color:var(--text-secondary)}',
    '.e1s-note svg{flex:none;margin-top:1px}',
    '.e1s-note b{color:var(--text-primary)}',
    '.e1s-hide{display:none !important}',
    '.e1-app--public .e1-site__footer{margin-top:0}',
    /* responsive */
    '@media (max-width:1180px){.e1s-path{grid-template-columns:repeat(5,minmax(0,1fr))}.e1s-rung{margin-bottom:0 !important;height:auto;min-height:128px}.e1s-grid--4{grid-template-columns:repeat(2,minmax(0,1fr))}.e1s-window__body{grid-template-columns:minmax(0,1fr)}.e1s-gatei{grid-template-columns:56px minmax(0,1fr) minmax(0,1fr)}.e1s-gatei>:last-child{grid-column:2/-1}}',
    '@media (max-width:960px){.e1s-split,.e1s-split--wide,.e1s-split--side,.e1s-calc,.e1s-phero__grid,.e1s-rp__out{grid-template-columns:minmax(0,1fr)}.e1s-grid--3{grid-template-columns:minmax(0,1fr)}.e1s-stats{grid-template-columns:repeat(2,minmax(0,1fr))}.e1s-stat:nth-child(3){padding-left:0;border-left:0}.e1s-sticky{position:static}.e1s-caps{grid-template-columns:minmax(0,1fr)}.e1s-dia{grid-template-columns:minmax(0,1fr)}.e1s-dia__arrow{transform:rotate(90deg);height:28px}.e1s-hero__disc{width:78vw;right:-30vw;top:auto;bottom:-44vw;transform:none}.e1s-hero__diag{left:62%}.e1s-hero__in{padding-bottom:38vw}}',
    '@media (max-width:720px){.e1s-wrap{padding:0 16px}.e1s-band{padding:56px 0}.e1s-h1{font-size:36px}.e1s-hero__h1{font-size:40px}.e1s-hero__kicker{font-size:17px;line-height:24px}.e1s-hero__in{padding-top:56px}.e1s-h2{font-size:28px;line-height:34px}.e1s-phero{padding:36px 0 32px}.e1s-phero__lead{font-size:17px;line-height:26px}.e1s-grid--2,.e1s-grid--4,.e1s-map{grid-template-columns:minmax(0,1fr)}.e1s-path{grid-template-columns:minmax(0,1fr)}.e1s-rung{min-height:0;height:auto;display:grid;grid-template-columns:34px minmax(0,1fr) auto;gap:2px 10px;align-items:center}.e1s-rung__n{grid-row:span 2}.e1s-rung__job{grid-column:2}.e1s-rung__st{grid-row:1/span 2;grid-column:3;margin:0;padding:0}.e1s-form{grid-template-columns:minmax(0,1fr)}.e1s-gl__item{grid-template-columns:minmax(0,1fr);gap:6px}.e1s-gatei{grid-template-columns:minmax(0,1fr);gap:8px}.e1s-gatei>:last-child{grid-column:auto}.e1s-quote{font-size:21px;line-height:28px}.e1s-stat__v{font-size:34px}.e1s-total{font-size:34px}.e1s-window__body{padding:12px}.e1s-formcard{padding:18px}.e1s-log li{grid-template-columns:28px 92px minmax(0,1fr)}.e1s-hero__strip{margin-top:40px}}',
    '@media (max-width:720px){.e1s-status{white-space:normal;text-align:left}.e1s-h1{font-size:32px;line-height:38px}.e1s-hero__h1{font-size:36px;line-height:42px}.e1s-h2{font-size:26px;line-height:32px}}',
    '@media (prefers-reduced-motion:reduce){.e1s-rung,.e1s-log li.is-new{transition:none;animation:none}}'
  ].join('\n');
  (function injectCss() {
    if (document.getElementById('e1s-css')) return;
    var st = document.createElement('style');
    st.id = 'e1s-css';
    st.textContent = CSS;
    document.head.appendChild(st);
  })();

  /* ------------------------------------------------------------------------
     Site navigation (overwrites the shell defaults)
     ------------------------------------------------------------------------ */
  E1.site.header = [
    { label: 'Product', href: '#/product' },
    { label: 'Assurance levels', href: '#/assurance-levels' },
    { label: 'Packs', href: '#/packs' },
    { label: 'Pricing', href: '#/pricing' },
    { label: 'Why elan1', href: '#/why-elan1' },
    { label: 'Developers', href: '#/developers' },
    { label: 'Verify a record', href: '#/verify' }
  ];
  E1.site.cta = [
    { label: 'Sign in', href: '#/auth/sign-in', kind: 'ghost' },
    { label: 'Book a working session', href: '#/demo', kind: 'primary' }
  ];
  E1.site.footer = [
    { title: 'Product', links: [
      { label: 'The control plane', href: '#/product' }, { label: 'How it works', href: '#/product/how-it-works' },
      { label: 'The Right Path', href: '#/product/right-path' }, { label: 'The Declaration', href: '#/product/declaration' },
      { label: 'Assurance levels', href: '#/assurance-levels' }, { label: 'Evidence', href: '#/evidence' },
      { label: 'Packs', href: '#/packs' }, { label: 'Industries', href: '#/industries' },
      { label: 'Pricing', href: '#/pricing' }, { label: 'Price calculator', href: '#/pricing/calculator' },
      { label: 'Why elan1', href: '#/why-elan1' }] },
    { title: 'Proof and trust', links: [
      { label: 'Verify a record', href: '#/verify' }, { label: 'Security and trust', href: '#/security' },
      { label: 'Sub-processors', href: '#/security/subprocessors' }, { label: 'Action Receipt standard', href: '#/standard' },
      { label: 'Status', href: '#/status' }, { label: 'Changelog', href: '#/changelog' },
      { label: 'Developers', href: '#/developers' }, { label: 'Docs', href: '#/docs' }, { label: 'Glossary', href: '#/glossary' }] },
    { title: 'Company', links: [
      { label: 'About', href: '#/about' }, { label: 'Company', href: '#/company' }, { label: 'Decision register', href: '#/company/decisions' },
      { label: 'Roadmap and gates', href: '#/roadmap' }, { label: 'Careers', href: '#/careers' }, { label: 'Contact', href: '#/contact' },
      { label: 'For auditors', href: '#/auditors' }, { label: 'For regulators', href: '#/regulators' }, { label: 'For insurers', href: '#/insurers' },
      { label: 'Partners', href: '#/partners' }, { label: 'Privacy', href: '#/legal/privacy' }, { label: 'Terms', href: '#/legal/terms' }] }
  ];
  E1.site.legal = 'elan1 is built on Claude. Governed agentic applications for the work that commits your business. elan1 Private Limited · Coimbatore and Chennai.';

  /* ------------------------------------------------------------------------
     Small helpers
     ------------------------------------------------------------------------ */
  function here() { return '#' + ((E1.state.route && E1.state.route.path) || '/'); }
  function routeCrumb() { var d = E1.state.route && E1.state.route.def; return d && typeof d.title === 'string' ? d.title.split(' — ')[0] : ''; }
  function wrap(html, cls) { return '<div class="e1s-wrap' + (cls ? ' ' + cls : '') + '">' + html + '</div>'; }
  function ic(n, s) { return c.icon(n, s || 16); }
  function prov(kind) { var k = String(kind).toUpperCase(); return '<span class="e1s-prov' + (k === 'MODELLED' ? ' e1s-prov--modelled' : '') + '" title="Provenance: ' + esc(k.toLowerCase()) + '">' + esc(k) + '</span>'; }
  function code(t) { return '<code class="e1s-code">' + esc(t) + '</code>'; }
  function status(kind, label) {
    var map = { spec: 'Specification', building: 'Building', ga: 'Generally available', notbuilt: 'Not built', draft: 'Published draft', parked: 'Parked', sketch: 'Spec sketch', reserved: 'Reserved, not built', refused: 'Refused', open: 'Open', notyet: 'Not yet attempted' };
    return '<span class="e1s-status e1s-status--' + esc(kind) + '"><i aria-hidden="true"></i>' + esc(label || map[kind] || kind) + '</span>';
  }
  function list(items, o) {
    o = o || {};
    return '<ul class="e1s-list' + (o.tight ? ' e1s-list--tight' : '') + '" role="list">' + items.map(function (t) {
      return '<li>' + ic(o.icon || 'check', 14) + '<span>' + (o.html ? t : esc(t)) + '</span></li>';
    }).join('') + '</ul>';
  }
  function head(o) {
    var id = o.id ? o.id + '-h' : E1.uid('h');
    return { id: id, html: '<div class="e1s-head"><div class="e1s-head__t">' + (o.eyebrow ? '<p class="e1s-eyebrow">' + esc(o.eyebrow) + '</p>' : '') +
      '<h2 class="e1s-h2" id="' + esc(id) + '">' + esc(o.title) + '</h2>' + (o.lead ? '<p class="e1s-lead">' + (o.leadHtml ? o.lead : esc(o.lead)) + '</p>' : '') + '</div>' +
      (o.actions ? '<div class="e1s-head__a">' + o.actions + '</div>' : '') + '</div>' };
  }
  /** A full-width band: {id, tone:'paper'|'sunken'|'surface'|'ink', eyebrow, title, lead, actions, body, tight, narrow} */
  function band(o) {
    var h = o.title ? head(o) : null;
    return '<section class="e1s-band e1s-band--' + (o.tone || 'paper') + (o.tight ? ' e1s-band--tight' : '') + '"' + (o.id ? ' id="' + esc(o.id) + '"' : '') + (h ? ' aria-labelledby="' + esc(h.id) + '"' : '') + '>' +
      wrap((h ? h.html : '') + (o.body || ''), o.narrow ? 'e1s-wrap--narrow' : '') + '</section>';
  }
  /** Inner-page hero with the single h1. {crumbs:[[label, href]], eyebrow, title, lead, actions, meta, aside, toc:[{id,label}]} */
  function hero(o) {
    var crumbs = [['Home', '#/']].concat(o.crumbs || []);
    var cr = '<nav aria-label="Breadcrumb"><ol class="e1s-crumbs">' + crumbs.map(function (cc, i) {
      return '<li>' + (i ? ic('chevron-right', 12) + ' ' : '') + '<a href="' + esc(cc[1]) + '">' + esc(cc[0]) + '</a></li>';
    }).join('') + '<li aria-current="page">' + ic('chevron-right', 12) + ' <span>' + esc(o.crumb || routeCrumb() || o.title) + '</span></li></ol></nav>';
    var text = (o.eyebrow ? '<p class="e1s-eyebrow">' + esc(o.eyebrow) + '</p>' : '') + '<h1 class="e1s-h1">' + esc(o.title) + '</h1>' +
      (o.lead ? '<p class="e1s-phero__lead">' + (o.leadHtml ? o.lead : esc(o.lead)) + '</p>' : '') +
      (o.actions ? '<div class="e1s-phero__actions">' + o.actions + '</div>' : '') +
      (o.meta ? '<div class="e1s-phero__meta">' + o.meta + '</div>' : '');
    var toc = o.toc ? '<ol class="e1s-toc" aria-label="On this page">' + o.toc.map(function (t, i) {
      return '<li><span>' + (i < 9 ? '0' : '') + (i + 1) + '</span><a href="' + esc(here()) + '" data-scrollto="' + esc(t.id) + '">' + esc(t.label) + '</a></li>';
    }).join('') + '</ol>' : '';
    return '<header class="e1s-phero">' + wrap(cr + '<div class="e1s-phero__grid' + (o.aside ? '' : ' e1s-phero__grid--solo') + '"><div>' + text + '</div>' + (o.aside ? '<div>' + o.aside + '</div>' : '') + '</div>' + toc) + '</header>';
  }
  function card(o) {
    var tag = o.href ? 'a' : 'div';
    return '<' + tag + ' class="e1s-card' + (o.cls ? ' ' + o.cls : '') + '"' + (o.href ? ' href="' + esc(o.href) + '"' : '') + '>' +
      ((o.k || o.icon || o.badge) ? '<div class="e1s-card__top">' + (o.k ? '<span class="e1s-card__k">' + esc(o.k) + '</span>' : (o.icon ? ic(o.icon, 20) : '<span></span>')) + (o.badge || '') + '</div>' : '') +
      (o.title ? '<h3 class="e1s-h3">' + esc(o.title) + '</h3>' : '') +
      (o.body ? (o.bodyHtml ? o.body : '<p class="e1s-card__d">' + esc(o.body) + '</p>') : '') + (o.extra || '') +
      (o.foot ? '<span class="e1s-card__foot">' + esc(o.foot) + ' ' + ic('arrow-right', 14) + '</span>' : '') + '</' + tag + '>';
  }
  function stat(v, l, s) { return '<div class="e1s-stat"><div class="e1s-stat__v">' + v + '</div><div class="e1s-stat__l">' + esc(l) + '</div>' + (s ? '<div class="e1s-stat__s">' + s + '</div>' : '') + '</div>'; }
  function quote(t, cite, sm) { return '<blockquote class="e1s-quote' + (sm ? ' e1s-quote--sm' : '') + '"><p style="margin:0">' + esc(t) + '</p>' + (cite ? '<cite>' + esc(cite) + '</cite>' : '') + '</blockquote>'; }
  function note(html, icon) { return '<p class="e1s-note">' + ic(icon || 'info', 16) + '<span>' + html + '</span></p>'; }
  function btn(label, href, kind, icon) { return c.button(label, { href: href, kind: kind || 'secondary', size: 'lg', iconRight: icon }); }
  function statesMenu(route, states) {
    return c.menu({ label: 'View states', icon: 'layers', kind: 'ghost', align: 'right', items: states.map(function (s) { return { label: s[1], href: '#' + route + (s[0] ? '?state=' + s[0] : ''), icon: s[2] || 'eye' }; }) });
  }
  function inr(n) { return fmt.inr(n); }
  function num(n) { return fmt.num(n); }
  function ynp(v) {
    var s = String(v || '');
    var word = /^yes/i.test(s) ? 'Yes' : /^partial/i.test(s) ? 'Partial' : /^not assessed/i.test(s) ? 'Not assessed' : 'No';
    var tone = word === 'Yes' ? 'good' : word === 'Partial' ? 'info' : 'neutral';
    var rest = s.replace(/^(yes|partial|no|not assessed)\s*[—–-]?\s*/i, '');
    return '<span class="e1s-cell">' + c.badge(tone, word, { subtle: true, icon: word === 'Yes' ? 'check' : word === 'Partial' ? 'minus' : 'x' }) + (rest ? '<small>' + esc(rest) + '</small>' : '') + '</span>';
  }

  /* ------------------------------------------------------------------------
     Sample and reference data for the public site (E1.data.site)
     Figures from the IM and the price book. Anything forecast is MODELLED.
     ------------------------------------------------------------------------ */
  var D = E1.data.site = {};

  D.boilerplate = 'elan1 is the agentic transformation company. We build governed agentic business applications: ten agentic apps on one control plane, ten industry configurations, and a human approval gate on the actions that commit your business. elan1 is built on Claude.';
  D.oneLine = 'Governed agentic applications for the work that commits your business.';
  D.pillars = [
    ['01', 'Governed by design', 'A human approval gate on every committing action, with a record behind it.'],
    ['02', 'One control plane', 'Ten agentic apps that share governance, identity and audit rather than each inventing it.'],
    ['03', 'Configured for the industry', 'Ten industry configurations off one codebase, so deployment is setup rather than a build.']
  ];
  D.l1Sentence = 'At L1, elan1 decides whether a write is permitted, forces a human to approve the writes that need it, executes it through a single writer, records the decision in a hash-chained append-only log, and meters it. The log is tamper-evident. It is not yet signed, not yet anchored to an external time source, and not yet verifiable by a third party who does not trust us.';

  /* The Right Path: 0b + nine rungs (ten checks). [id, name, job, writes, budget, kernel] */
  D.rungs = [
    ['0b', 'STOP', 'Tenant kill switch, revocation, blacklist, regulator directive.', 'Nothing — a stopped tenant refuses every write, refusals included.', '4 ms (0b–2)', false, 'Kill switch, revocation, directive.'],
    ['1', 'IDENTITY', 'Actor, tenant and token resolved. actor_kind is set by the kernel, never by the caller.', 'actor · actor_kind · tenant', '″', false, 'Actor, tenant and token resolved.'],
    ['2', 'WRITE DOOR', 'The write type exists at an explicit integer version. There is no generic write.', 'write type · declaration id · version', '″', false, 'Write type at an explicit version.'],
    ['3', 'PRE-GATES', 'Nine gates in declared order, six never skippable. No gate reads a clock.', 'every gate outcome', '8 ms', false, 'Nine gates in declared order.'],
    ['4', 'evaluate()', 'Versioned rules decide allow, refuse or escalate — never a score.', 'policy version', '12 ms', false, 'Versioned rules. Never a score.'],
    ['5', 'GUARDRAIL', 'Allow-lists, then blast radius. Catches “update one invoice” arriving as an unbounded filter.', 'blast radius', '8 ms (5–6)', false, 'Allow-lists, then blast radius.'],
    ['6', 'AUTONOMY', 'The A-level this actor holds now. A missing grant is A0.', 'autonomy level', '″', false, 'The A-level held right now.'],
    ['7', 'ACT', 'Snapshot, shadow sandbox apply, gate re-run, identical bytes to live with a single-use 10-minute credential.', 'record id · version · payload digest', '18 ms', true, 'Shadow sandbox, then live.'],
    ['8', 'PROOF', 'Sixteen fields, hash-chained, returned synchronously. Refusals are recorded too.', 'seq · previous digest · lexicon digest · recorded at', '12 ms', true, 'Sixteen fields, chained.'],
    ['9', 'METERED', 'Exactly one meter event. Refusals at quantity zero, enforced by the database.', 'meter event', '2 ms', true, 'One meter event. Refusals ₹0.']
  ];

  /* Three walk-throughs of the same write type (Rekha / ar-agent / Venkat Raman, erp.ar v7, policy v11) */
  D.scenarios = {
    committed: { label: 'Committed', seq: 4101, stop: 10, kind: 'committed', title: 'SINV-2026-01187 submitted · ₹2,40,000 · proof #4,101',
      log: {
        '0b': ['ok', 'kaveri-spinning is not stopped'], '1': ['ok', 'Venkat Raman · person · approver of OB-2026-0412'], '2': ['ok', 'erp.sales_invoice.submit @ erp.ar v7'],
        '3': ['ok', '7 of 7 declared gates passed'], '4': ['ok', 'allow at policy v11'], '5': ['ok', 'one_counterparty, as declared'],
        '6': ['ok', 'approval #4,100 satisfies A2 Propose'], '7': ['ok', 'sandbox and live agree · 1 record written'], '8': ['ok', '#4,101 chained to #4,100'], '9': ['ok', '1 governed action · per counterparty'] } },
    refused: { label: 'Not done', seq: 4098, stop: 3, kind: 'refused', title: 'Not done — credit limit · GATE.PRECONDITION_FAILED · proof #4,098',
      log: {
        '0b': ['ok', 'kaveri-spinning is not stopped'], '1': ['ok', 'ar-agent · agent · A3 Act reversible'], '2': ['ok', 'erp.sales_invoice.submit @ erp.ar v7'],
        '3': ['no', 'G9 precondition: exposure ₹4,20,000 > limit ₹3,00,000'], '8': ['ok', '#4,098 recorded · zero record id'], '9': ['ok', 'quantity 0 · ₹0'] } },
    escalated: { label: 'Waiting on a person', seq: 4099, stop: 6, kind: 'escalated', title: 'Waiting on a person · OB-2026-0412 · expires in 4 h · proof #4,099',
      log: {
        '0b': ['ok', 'kaveri-spinning is not stopped'], '1': ['ok', 'ar-agent · agent · A2 Propose'], '2': ['ok', 'erp.sales_invoice.submit @ erp.ar v7'],
        '3': ['ok', '7 of 7 declared gates passed'], '4': ['ok', 'allow at policy v11'], '5': ['ok', 'one_counterparty, as declared'],
        '6': ['esc', 'A2 needs a person · resolver set ar-approvers'], '8': ['ok', '#4,099 obligation recorded'], '9': ['ok', 'quantity 0 · nothing written yet'] } }
  };

  D.gates = [
    ['G1', 'Consent', 'Never', 'A recorded, unexpired consent covers this purpose.', 'GATE.CONSENT_MISSING'],
    ['G2', 'Residency', 'Never', 'The record’s residency domain matches the tenant’s (Mumbai).', 'GATE.RESIDENCY_MISMATCH'],
    ['G3', 'Retention', 'Never', 'The record is inside its declared retention window.', 'GATE.RETENTION_WINDOW_CLOSED'],
    ['G4', 'Dual control', 'Never', 'A second named person has approved this write.', 'GATE.DUAL_CONTROL_PENDING'],
    ['G5', 'Rate', 'With a decision record', 'Within the declared per-actor rate.', 'GATE.RATE_EXCEEDED'],
    ['G6', 'Budget', 'With a decision record', 'Within the declared per-period budget.', 'GATE.BUDGET_EXHAUSTED'],
    ['G7', 'Counterparty', 'Never', 'The counterparty is known and not sanctioned.', 'GATE.COUNTERPARTY_UNKNOWN'],
    ['G8', 'Schedule', 'With a decision record', 'Inside a declared operating window.', 'GATE.OUTSIDE_SCHEDULE'],
    ['G9', 'Precondition', 'Never', 'A declared record state holds — credit limit, period open, no duplicate number.', 'GATE.PRECONDITION_FAILED']
  ];

  D.autonomy = [
    ['A0', 'Observe', 'Reads only. Cannot reach the ACT rung by any path. A missing grant resolves here.'],
    ['A1', 'Draft', 'Produces a write intent; a person must submit it.'],
    ['A2', 'Propose', 'Submits; a person approves before the write.'],
    ['A3', 'Act reversible', 'Acts alone where a reversal plan exists.'],
    ['A4', 'Act bounded', 'Acts alone inside a declared blast radius and budget.'],
    ['A5', 'Act broad', 'Acts alone at tenant scope; the declaration itself needs dual control.']
  ];

  D.calls = [
    ['define', 'Registers a write type at an explicit declaration version and returns a content-addressed digest. Registering is itself a governed write under dual control.', 'Control-plane token'],
    ['assert', 'The central call. Runs the whole path in order and returns committed, refused or escalated with the proof sequence and digest, synchronously.', 'Tenant token, act scope'],
    ['seal', 'The chain writer. At L1 it returns a hash-chain receipt; at L2 the same call also signs.', 'The kernel only'],
    ['verify', 'Recomputes preimage and digest octet for octet and walks the chain. At L1, verify requires us.', 'Read-only token'],
    ['scope', 'Resolves blast radius and autonomy for rendering. Advisory only, because assert re-resolves both.', 'Read-only token'],
    ['refuse', 'Emits a typed refusal from a closed register of 43 codes.', 'Tenant token, act scope']
  ];

  D.blocks = [
    ['1', 'identity', 'this thing', 'declaration_id, name, slug, owner_role (a role, not a person — people leave), residency_domain, system_of_record, lexicon_ref'],
    ['2', 'shape', 'shaped this way', 'record_type; fields with type, cardinality, required and classification (public, internal, personal, financial); links — the ontology’s edges'],
    ['3', 'permissions', 'may be changed by these actors', 'grants by actor_kind (human, agent, system), role, write_type, min_autonomy A0–A5, may_approve — never true for an agent'],
    ['4', 'write_types', 'through these write types', 'name, label, intent, blast_radius, dual_control, ordered gates, and exactly one of reversal_plan or irreversible: true'],
    ['5', 'gates', 'subject to these gates', 'one of nine named gates, enabled, params, as_of_dependency, refusal_codes'],
    ['6', 'proof_binding', 'proving these fields', 'the fields committed to the proof, canonicalisation elan1_lp_v1, per-record salt scope'],
    ['7', 'channels', 'over these channels', 'web, mobile, messaging, api, mcp, voice — the write types each carries, may_approve, and mode: enforced or attested advisory']
  ];

  D.levels = {
    L1: { name: 'Guarded', claim: 'The write was controlled.', buyer: 'The operator', q: 'Can I let this run without it doing something I cannot undo?', gate: 'G2', gateText: 'Generally available when gate G2 passes: eight readiness rows measured and a third party integrated against KernelPort.', status: 'building', price: 180000,
      say: 'Our agents cannot write to our books without passing rules we set, a person approves anything material, and we have an unbroken internal record of every attempt, including the refusals.',
      has: ['Nine gates, versioned rules and an autonomy ladder on every write', 'A named person approves what the declaration says needs one', 'Single writer; shadow sandbox before live', 'Reverse this — 30-day window where a reversal plan exists', 'Hash-chained, tamper-evident record of commits, refusals and escalations', 'Refusals metered at ₹0'],
      not: ['No signature, anchor time or verifier verdict', 'Not checkable by someone who does not trust elan1 — at L1, verify requires us', 'Satisfies no regulation on its own; serves as an internal control'] },
    L2: { name: 'Attested', claim: 'A stranger can check that.', buyer: 'The auditor’s counterparty', q: 'Can I hand this over?', gate: 'G4', gateText: 'Arrives when gate G4 passes: a paying customer’s write verifies on an air-gapped machine, with the witness named.', status: 'spec', price: 600000,
      say: '…and here is a file you can check yourself, on your own machine, without our vendor’s help.',
      has: ['Ed25519 signature over the frozen sixteen-field record', 'RFC 3161 anchoring by two authorities, one India-based', 'An exportable evidence bundle with eight members', 'The offline verifier, free, as source, to anyone', 'Verifier profiles for a regime, such as in-mca-audit-trail'],
      not: ['Records written before the upgrade stay L1 for ever', 'Does not prove the transaction was genuine or the rules adequate'] },
    L3: { name: 'Proven', claim: 'The record survives us.', buyer: 'The market', q: 'Does this survive the vendor?', gate: 'G6', gateText: 'Begins on an event, not a date — gate G6: an auditor who does not work for us accepts an L2 bundle in a real engagement, in writing.', status: 'spec', price: 2400000,
      say: '…and the format is published, so you can check it in ten years whether or not that vendor exists.',
      has: ['A second, independent seal implementation that agrees octet for octet', 'Published test vectors, including a known-tampered bundle', 'Counter-signature by a party that is not elan1', 'Customer-held keys, selective disclosure and cross-organisation receipts'],
      not: ['No regulator has approved it', 'Still does not prove the transaction was genuine'] }
  };

  /* Roadmap gates — conditions, not dates. Every status reads "not yet attempted" (IM, 22 Sep 2026). */
  D.roadmap = [
    { id: 'G1', name: 'First governed write', cond: 'An end-to-end write, gate check, approval and proof in a design partner’s own site, with the bypass attempt shown failing.', releases: 'The kernel leaves the building. Customer zero runs on the real stack.', owner: 'Kernel lead' },
    { id: 'G2', name: 'L1 Guarded, generally available', cond: 'Eight readiness rows measured rather than asserted, and a third party integrated against KernelPort under a signed agreement.', releases: 'L1 Guarded list price is set and published. Production keys are issued after review.', owner: 'Founder' },
    { id: 'G3', name: 'Two implementations agree', cond: 'Two seal implementations, written from the specification text alone, agree on all 64 vectors. Signing key per residency domain with one rotation performed. Two timestamp authorities contracted, one India-based.', releases: 'Signing can start. Nothing is back-signed.', owner: 'Kernel lead · Founder (authority contract)' },
    { id: 'G4', name: 'A stranger’s machine says PASS', cond: 'A paying customer’s write verifies on an air-gapped machine, with the witness named. The verifier ships with the tampered bundle.', releases: 'L2 Attested and the first India pack, ledger1, with a named statutory auditor.', owner: 'Kernel lead' },
    { id: 'G5', name: 'Evidence on its own line', cond: 'A signed contract with evidence priced on its own line item, bought by a buyer who is not the operator.', releases: 'Evidence is a product, not a feature. invoice1 and collect1 proceed on their own gates.', owner: 'Founder' },
    { id: 'G6', name: 'An outsider relies on it', cond: 'An auditor who does not work for us and is not paid by us accepts an L2 bundle as evidence in a real engagement, and says so in writing we may keep.', releases: 'L3 Proven work may begin — including a slide.', owner: 'Founder' }
  ];

  D.rungLadder = [
    ['R1', 'First paying customer', 'A signed order and payment received.'],
    ['R2', 'The adapter survives a second system of record', 'The same kernel governs writes into a second, different system.'],
    ['R3', 'The gating rung', 'A third party pays for a governed write.'],
    ['R4', 'A stranger accepts the proof', 'Someone with no relationship to us relies on a bundle.'],
    ['R5', 'The receipt outlives the vendor', 'A receipt verifies with no elan1 software in the loop.']
  ];

  D.packs = {
    ledger1: {
      id: 'ledger1', obTitle: 'The MCA audit-trail rule, in force since 1 April 2023.', order: 'First pack', statusKind: 'spec', status: 'Specification — the first India pack', gate: 'G4', minLevel: 'L2',
      title: 'Changes to the books of account, and the evidence that each one passed stated rules.',
      obligation: 'Ministry of Corporate Affairs — Companies (Accounts) Rules, Rule 3(1) audit trail (edit log) for accounting software, in force since 1 April 2023, with Rule 11(g) auditor reporting.',
      clauses: ['An audit trail of each and every transaction', 'An edit log of each change made in the books of account', 'The date on which each change was made', 'The audit trail shall not be disabled'],
      buyer: 'The promoter or finance controller of a ₹5–50 crore firm, usually on their CA’s advice. Budget line: audit and compliance, not software.',
      auditor: 'The statutory auditor — named in the pilot.',
      writeTypes: [
        ['sales_invoice.submit', 'one_counterparty', 'Native cancel of the invoice and its IRN', 'Above ₹2 lakh'],
        ['sales_invoice.cancel', 'one_counterparty', 'Honestly irreversible after the 24-hour IRN window', 'Always'],
        ['purchase_invoice.submit', 'one_counterparty', 'Native undo', 'Above ₹2 lakh'],
        ['payment_entry.submit', 'one_counterparty', 'Compensating instrument', 'Always'],
        ['journal_entry.submit', 'batch', 'Compensating instrument', 'Always'],
        ['customer.update', 'one_record', 'Native undo (credit terms, GSTIN)', 'On GSTIN change']
      ],
      gates: ['consent', 'residency', 'retention', 'counterparty', 'precondition', 'dual_control', 'budget'],
      gatesNote: 'Budget is declared on because a runaway journal entry is the failure mode the buyer imagines first.',
      profile: [['Profile', 'in-mca-audit-trail v1'], ['Rule as at', '1 April 2023'], ['Applies to records from', '1 July 2027'], ['Minimum assurance level', 'L2 Attested'], ['Refusals required', 'Yes'], ['Continuity scope', 'full_chain']],
      checks: [
        ['C01', 'structural', 'Every governed change to a book of account appears as a record', 'fail_profile'],
        ['C02', 'binding', 'Each record names who made the change and whether they were a person or software', 'fail_profile'],
        ['C03', 'binding', 'Each change identifies the record changed and the version written', 'fail_profile'],
        ['C04', 'temporal', 'Each change carries the date it was made, from the platform clock', 'fail_profile'],
        ['C05', 'integrity', 'The trail cannot have been disabled without detection', 'fail_integrity'],
        ['C06', 'temporal', 'The trail cannot have been silently truncated', 'fail_integrity']
      ],
      scores: [['G-A', 'A dated hook', 'Pass', '1 April 2023'], ['G-B', 'An auditor', 'Pass', 'The statutory auditor, named in the pilot'], ['G-C', 'Honestly reversible', 'Pass', 'Each write type declares which it is'], ['G-D', 'Evidence sold separately', 'Pass, provisionally', 'This is the gate the pilot actually tests'], ['G-E', 'We own the write', 'Pass', 'rung1 hosted mode; the single writer is the only path']],
      limits: 'A PASS under in-mca-audit-trail v1 establishes that the changes contained in this bundle were made through the elan1 governed write path, that each carries an actor, an actor kind, a target record identifier and a platform-clock timestamp, that the sequence is unbroken and externally anchored, and that the refused attempts are present. It does not establish that the books of account are complete: changes made directly in the accounting system, outside this write path, are recorded by that system’s own audit trail and are not in this bundle. It does not establish that the transactions were genuine, that the rules applied were adequate, or that this bundle satisfies any obligation — that determination belongs to the reader. This profile is the vendor’s reading of the obligation; it has not been reviewed or accepted by the Ministry of Corporate Affairs or by any regulator.',
      extra: 'A second profile — the US SEC Rule 17a-4 audit-trail alternative — is a valid second profile under the same pack, not a second product.'
    },
    invoice1: {
      id: 'invoice1', obTitle: 'GST e-invoicing, mandatory since 1 August 2023.', order: 'Second pack', statusKind: 'spec', status: 'Specification — second, not abandoned', gate: 'G5', minLevel: 'L2',
      title: 'The write that requests an e-invoice reference, and the evidence that it passed stated rules.',
      obligation: 'GST e-invoicing — mandatory at a ₹5 crore turnover threshold since 1 August 2023; firms above ₹10 crore must report within 30 days. An invoice without a valid IRN has no standing, and the buyer cannot claim input tax credit.',
      clauses: ['Every B2B invoice above the threshold carries an IRN from the invoice registration portal', 'Reporting inside the window for the turnover band', 'Cancellation only inside the 24-hour window'],
      buyer: 'The finance controller of a firm above the e-invoicing threshold.',
      auditor: 'The statutory or GST auditor.',
      writeTypes: [
        ['sales_invoice.submit', 'one_counterparty', 'Native cancel inside the 24-hour window', 'Above ₹2 lakh'],
        ['sales_invoice.cancel', 'one_counterparty', 'Honestly irreversible after the 24-hour window', 'Always']
      ],
      gates: ['consent', 'residency', 'retention', 'counterparty', 'precondition', 'dual_control'],
      gatesNote: 'elan1 governs the write that requests the IRN. It does not own the clearance.',
      profile: [['Profile', 'in-gst-einvoice (proposed id)'], ['Minimum assurance level', 'L2 Attested'], ['Refusals required', 'Yes']],
      checks: [],
      scores: [['G-A', 'A dated hook', 'Pass', '1 August 2023 threshold'], ['G-B', 'An auditor', 'Pass', 'GST and statutory audit'], ['G-C', 'Honestly reversible', 'Pass', '24-hour cancellation window declared'], ['G-D', 'Evidence sold separately', 'Not yet tested', 'Follows ledger1’s pilot'], ['G-E', 'We own the write', 'Partial', 'We govern the request; the portal owns the clearance']],
      limits: 'The IRN, the portal response and the twenty-four-hour cancellation window are the accounting system’s evidence and not elan1’s. This pack establishes that the request to register an invoice passed stated rules, with a named actor and, where required, a named approver. It does not establish that the invoice was cleared.',
      extra: 'No IRN volume figure is shown anywhere on this site. Our sources could not verify one, so it is not asserted.'
    },
    collect1: {
      id: 'collect1', obTitle: 'Four layers of obligation, each with someone obliged to ask.', order: 'Third pack', statusKind: 'sketch', status: 'Spec sketch — rule citations need counsel confirmation before anything ships', gate: 'G5', minLevel: 'L2',
      title: 'Governed collections calls: who may be called, when, by which script, and what was said.',
      obligation: 'Four layers: RBI fair-practice recovery conduct; telecom rules (DLT registration, templates, preference register, number series, attempt caps); DPDP; and the lender’s board-approved policy and outsourcing rules.',
      clauses: ['Calling hours in the borrower’s location', 'No harassment and no third-party disclosure', 'An identified caller and a grievance route', 'Lawful basis, purpose limitation, retention and erasure'],
      buyer: 'A regulated lender (bank or NBFC) with an early-bucket book.',
      auditor: 'The lender’s internal audit and its supervisor’s examination team — with an auditor login from day one.',
      writeTypes: [
        ['call.attempt', 'one_counterparty', 'Irreversible', 'Per authority band'],
        ['call.record', 'one_record', 'Append-only', '—'],
        ['promise.capture', 'one_counterparty', 'Reversible — retracted with its own record', 'Outside the declared band'],
        ['disposition.set', 'one_record', 'Reversible', '—'],
        ['escalation.raise', 'one_counterparty', 'Reversible', '—'],
        ['preference.update', 'one_counterparty', 'Irreversible by design — never undone by an agent', 'Always']
      ],
      gates: ['Before the dial: lawful basis · preference scrub · time window · attempt cap and cooling period · script and template version · authority band · number series', 'During the call: automated-call disclosure · identity check · read-back · prohibited-language guard · human path (“connect me to a person” always works)', 'After the call: recording integrity · disposition recorded'],
      gatesNote: 'Fourteen gates in three phases. Sixteen refusals in a closed set, billed at zero.',
      profile: [['Profile', 'in-rbi-collections v1'], ['Priced', 'Per governed call, refusals at zero, evidence sold separately per regime'], ['Autonomy cap', 'State facts, take a promise inside a band, escalate. Never negotiate a settlement or waive a charge.']],
      checks: [],
      scores: [['G-A', 'A dated hook', 'Pass (to confirm)', 'Citations need counsel confirmation'], ['G-B', 'An auditor', 'Pass', 'Internal audit and the supervisor'], ['G-C', 'Honestly reversible', 'Pass', 'call.attempt is declared irreversible'], ['G-D', 'Evidence sold separately', 'Not yet tested', '—'], ['G-E', 'We own the write', 'Open', 'If the lender’s core system owns the write, this path is Attested advisory, not Enforced — and the pack says so']],
      limits: 'It does not prove that the debt is valid. It does not prove that the person who answered is the borrower, beyond the identity check performed. It does not prove that the conversation was kind. And the audio is proved authentic only from our capture point onward.',
      extra: 'Not a funded pack. Two dependencies: a carrier partner, and gate G-E.'
    }
  };
  D.packsRefused = [
    ['retail1', 'G-B', 'Reversible, low stakes; nobody audits a price change.'],
    ['edu1', 'G-D', 'No buyer for evidence on its own line.'],
    ['energy1', 'G-E', 'The write path belongs to SCADA vendors.'],
    ['agri1', 'G-B', 'Subsidy audits are annual and on paper.'],
    ['legal1', 'G-E', 'The matter lives in someone else’s document system.'],
    ['public1', 'G-A and G-D', 'The procurement cycle outlasts the runway.']
  ];
  D.packsReserved = ['manufacture1', 'realestate1', 'health1', 'bank1', 'insure1', 'telco1', 'gov1'];
  D.packGates = [
    ['G-A', 'A dated hook', 'A named regulation, standard or contract with a date on it.', 'The hook is a principle, a direction of travel, or “regulators are increasingly focused on”.'],
    ['G-B', 'An auditor', 'Somebody whose job is to ask for the evidence — someone who could be telephoned.', 'Nobody is obliged to ask. If nobody is obliged to ask, nobody asks.'],
    ['G-C', 'Reversible, or honestly irreversible', 'The write types can declare which they are without lying.', 'Every important action is irreversible and everyone pretends otherwise.'],
    ['G-D', 'Evidence sold separately', 'A buyer would pay for the bundle on its own line item.', 'Evidence is a nice-to-have attached to something else.'],
    ['G-E', 'We own the write', 'elan1 is in the write path, not reading somebody else’s log.', 'We observe rather than govern. Telemetry is not evidence.']
  ];
  D.packTests = [['T1', 'Declaration validates'], ['T2', 'Profile certified by a non-author'], ['T3', 'Reversal is honest — a dated drill per write type'], ['T4', 'At least one real refusal per gate'], ['T5', 'Bundle PASS on an air-gapped machine run by an outsider'], ['T6', 'A tampered bundle gives FAIL_INTEGRITY, naming record and field'], ['T7', 'A non-conforming bundle gives FAIL_PROFILE, never 1'], ['T8', 'The auditor states, unprompted, what it does not prove']];
  D.buyerPromise = [
    'Every governed change of these types went through stated rules, with a named actor and, where required, a named approver.',
    'Here is a file covering a period you choose. Your auditor can check it on their own machine, offline, with software they did not get from us.',
    'Here is what that file does not establish, in the profile’s own words, printed in every report.'
  ];

  /* Price book — MODELLED list prices, per tenant per year, ₹90 = US$1 */
  D.price = {
    L1: { floor: 180000, incl: 480000, rate: 1.60, usd: 2000, eff: 0.375 },
    L2: { floor: 600000, incl: 1500000, rate: 1.20, usd: 6667, eff: 0.400 },
    L3: { floor: 2400000, incl: 4200000, rate: 0.90, usd: 26667, eff: 0.571 },
    SOV: { floor: 12000000, incl: 0, rate: 0.55, usd: 133333, eff: null },
    pack: 135000, profile: 300000, seat: 45000, bundle: 2500, partner: 150000
  };
  D.presets = [
    { id: 'entry', label: 'Entry · L1 + one pack', level: 'L1', actions: 300000, refusals: 9000, packs: 1, profiles: 0, seats: 0, bundles: 0, expect: 315000 },
    { id: 'mid', label: 'Mid-market L2', level: 'L2', actions: 3000000, refusals: 146000, packs: 1, profiles: 1, seats: 0, bundles: 0, expect: 2835000 },
    { id: 'large', label: 'Large regulated L3', level: 'L3', actions: 10000000, refusals: 412000, packs: 2, profiles: 2, seats: 20, bundles: 0, expect: 9390000 },
    { id: 'sov', label: 'Sovereign deployment', level: 'SOV', actions: 0, refusals: 0, packs: 0, profiles: 0, seats: 0, bundles: 0, expect: 12000000 }
  ];

  /* Competitive matrix v3 (E08) — 20 rows; readings as at 20 Sep 2026, UNVERIFIED unless marked */
  D.matrix = [
    { slug: 'credo-ai', v: 'Credo AI', q: 'doc', obj: 'Use case / model', e: 'No', r: 'No', i: 'No', f: 'No' },
    { slug: 'trustible', v: 'Trustible', q: 'doc', obj: 'Use case / regulation', e: 'No', r: 'No', i: 'No', f: 'No' },
    { slug: 'ibm-watsonx-governance', v: 'IBM watsonx.governance', q: 'doc', obj: 'Model', e: 'No', r: 'No', i: 'No', f: 'No' },
    { slug: 'servicenow-ai-control-tower', v: 'ServiceNow AI Control Tower', q: 'action', obj: 'Agent / workflow', e: 'Partial — inside ServiceNow', r: 'Partial — workflow records', i: 'No', f: 'No' },
    { slug: 'truyo', v: 'Truyo', q: 'doc', obj: 'Use case / privacy request', e: 'No', r: 'No', i: 'No', f: 'No' },
    { slug: 'airia', v: 'Airia', q: 'model', obj: 'Agent', e: 'Partial — agent gateway', r: 'No', i: 'No', f: 'No' },
    { slug: 'onetrust-ai-governance', v: 'OneTrust', q: 'doc', obj: 'Policy / data asset', e: 'No', r: 'No', i: 'No', f: 'No' },
    { slug: 'modelop', v: 'ModelOp + Kong', q: 'model', obj: 'Model, plus the API endpoint', e: 'Partial — at the API gateway', r: 'No', i: 'No', f: 'No' },
    { slug: 'monitaur', v: 'Monitaur', q: 'doc', obj: 'Model + control evidence', e: 'No', r: 'Partial — evidence about a model', i: 'No', f: 'No' },
    { slug: 'holistic-ai', v: 'Holistic AI', q: 'doc', obj: 'Model risk', e: 'No', r: 'No', i: 'No', f: 'No' },
    { slug: 'saidot', v: 'Saidot', q: 'doc', obj: 'Use case / policy', e: 'No', r: 'No', i: 'No', f: 'No' },
    { slug: 'cranium', v: 'Cranium', q: 'doc', obj: 'AI asset inventory', e: 'No', r: 'No', i: 'No', f: 'No' },
    { slug: 'relyance', v: 'Relyance', q: 'doc', obj: 'Data flow', e: 'No', r: 'No', i: 'No', f: 'No' },
    { slug: 'sap', v: 'SAP Agent Hub', q: 'action', obj: 'Agent', e: 'Partial — inside SAP', r: 'Partial — SAP’s own document trail', i: 'No', f: 'No' },
    { slug: 'boomi-agent-control-tower', v: 'Boomi Agent Control Tower', q: 'model', obj: 'Agent / integration', e: 'Partial — registry, guardrails, kill switch', r: 'No — observability and audit logs', i: 'No', f: 'No' },
    { slug: 'zenity', v: 'Zenity', q: 'model', obj: 'Agent (security)', e: 'Partial — blocks agent behaviours', r: 'No', i: 'No', f: 'No' },
    { slug: 'noma', v: 'Noma Security', q: 'model', obj: 'Agent / AI runtime', e: 'Partial — runtime protection', r: 'No', i: 'No', f: 'No' },
    { slug: 'microsoft-agent-365', v: 'Microsoft Agent 365', q: 'model', obj: 'Agent identity', e: 'Partial — identity, DLP, conditional access', r: 'No — audit logs', i: 'No', f: 'No' },
    { slug: 'palantir-aip', v: 'Palantir AIP', q: 'action', obj: 'The action, inside Foundry', e: 'Yes — but only on Foundry objects', r: 'Yes — on Foundry objects', i: 'No', f: 'Partial' },
    { slug: null, self: true, v: 'elan1 (L1, September 2026)', q: 'self', obj: 'The governed write', e: 'No — nothing in production', r: 'No — nothing in production', i: 'No — L1 is unsigned by design', f: 'No — nothing in production' }
  ];

  D.decisions = [
    ['DR-001', 'One kernel. Products never build their own gates, approval, proof or meter.', 'rung1 and stack1 screens call the elan1 layer and never render their own gate UI.'],
    ['DR-002', 'Temporal owns anything touching a customer’s books.', 'Workflow retries show “Applying your change — retrying”.'],
    ['DR-003', 'Windmill is not adopted in v1.', 'Licence register row reads BLOCKED.'],
    ['DR-004', 'n8n and Inngest are excluded.', 'Licence register rows read BLOCKED.'],
    ['DR-005', 'rung1 ERP is the only priced product in Phase 1.', 'rung1 publishes ₹2,499 / 7,999 / 19,999 / 49,999+ a month by turnover band.'],
    ['DR-006', 'elan1 ships L1 only in Phase 1.', 'The L1 honesty rule: no signature, anchor time or verifier verdict at L1.'],
    ['DR-007', 'verna1 is parked.', 'Never a live product in navigation.'],
    ['DR-008', 'rung1 Commerce is parked until Phase 4 and 25 paying customers.', 'The roadmap shows it as parked with its reopen condition.'],
    ['DR-009', '“Governance” is banned in rung1 and stack1 copy.', 'They say “the elan1 layer”, “elan1 approval step”, “elan1 proof record”.'],
    ['DR-010', '“Designed” scores zero in every competitive matrix.', 'elan1’s own row reads No until it runs in a customer’s production tenant.'],
    ['DR-011', 'One numbering scheme: P, A, REF-nn, REG-T, G.', 'Labels across every surface use it.'],
    ['DR-012', 'Declaration block 7 is channels.', 'The word “doors” now means only the Four Doors.'],
    ['DR-013', 'seal stays in KernelPort at L1 and returns a hash-chain receipt.', 'At L1 the screen says “Proof record”, never “Signed”.']
  ];

  D.glossary = [
    ['A0–A5 (autonomy levels)', 'agents', 'A property of the actor, not the tool. A0 Observe, A1 Draft, A2 Propose, A3 Act reversible, A4 Act bounded, A5 Act broad. A missing grant resolves to A0. There is no A6, and no API sets a level.', '#/product/how-it-works'],
    ['Action class', 'agents', 'A named grouping of write types over which autonomy can be granted, reviewed and raised. Earned autonomy operates on an action class, not a single write.', '#/agents/autonomy'],
    ['Action Receipt', 'standard', 'The published receipt format: thirteen members, a limits line that is required, and conformance levels CL-1 to CL-4 plus CL-D. Published, not open, until another organisation’s implementation passes.', '#/standard'],
    ['Anchor', 'evidence', 'A timestamp token from an independent authority over a Merkle root of a batch of record digests. An upper bound on time: existence, form, and no later than. It is the only mechanism that detects a chain cut at the tail.', '#/evidence'],
    ['Approval', 'work', 'A governed write, not a flag. It records the approver, a digest of the payload they were shown, and the time. Buttons read Approve and Reject; Reject needs a sentence.', '#/work/decide/OB-2026-0412'],
    ['Assurance level', 'levels', 'A property of the proof and the claim, never of the policy. L1 Guarded, L2 Attested, L3 Proven. Levels are claims, not product tiers with brand names.', '#/assurance-levels'],
    ['Attested advisory', 'modes', 'The integration mode where the caller holds the credential. Every attempt is evaluated and recorded; nothing physically stops a caller that ignores a refusal. The claim is “evaluated and recorded”.', '#/product'],
    ['Blast radius', 'declaration', 'How much a write may touch: one record, one counterparty, a batch, the whole tenant, or across an organisation boundary. It sets the meter basis and forces dual control at tenant scope and above.', '#/product/declaration'],
    ['Break-glass', 'work', 'A declared write type with dual control, recorded and visible to the tenant. There is no admin mode.', '#/work/break-glass'],
    ['Chain', 'evidence', 'The per-tenant, append-only sequence of proof records, each carrying the previous digest. Hash-chained and tamper-evident.', '#/assurance/chain'],
    ['Chain standing', 'evidence', 'Three-valued: continuous, break at seq N, or not checked over a range — always with the scope and count beside it. Never a green tick.', '#/assurance/chain'],
    ['Channels', 'declaration', 'Block 7 of the Declaration: web, mobile, messaging, API, MCP and voice, the write types each carries, whether approval is available on it, and its mode. A channel adapts; it never decides.', '#/product/declaration'],
    ['Counterparty verification seat', 'pricing', 'Receiving-side console access — register, binding and dispute log — for a party that receives receipts. It is not the verifier, which is free.', '#/pricing'],
    ['Declaration', 'declaration', 'The elan1 Ontology: one machine-readable object in seven blocks that says what a module is and what it may do. Forward-only integer versions; nothing resolves to “latest” in production.', '#/product/declaration'],
    ['Dual control', 'gates', 'Gate G4: a second named person has approved this write. The proposer can never also be the approver.', '#/product/how-it-works'],
    ['Enforced', 'modes', 'The integration mode where the kernel holds the credential, or the target accepts only kernel tokens. The claim: this write could not have occurred without passing the gates.', '#/product'],
    ['Escalation', 'outcomes', 'The honest version of warn: a person decides and the write does not proceed until they do. Shown as “Waiting on a person”.', '#/product/right-path'],
    ['Evidence bundle', 'evidence', 'A directory that needs nothing from us, with eight members: manifest.json, seals.jsonl, chain.json, anchors/, keys.json, declarations/, lexicon/ and VERIFY.txt. Arrives at L2.', '#/evidence'],
    ['Exit codes', 'evidence', 'The offline verifier reports 0 PASS, 1 FAIL_INTEGRITY, 2 FAIL_PROFILE, 3 INCOMPLETE, 4 UNSUPPORTED, 5 USAGE. 1 and 2 are never collapsed.', '#/verify/exit-codes'],
    ['Four Doors', 'console', 'The console grammar: Work · Records · Agents · Assurance. Exactly four, no fifth, never renamed.', '#/product'],
    ['Gate (pack admission)', 'packs', 'G-A to G-E: a dated hook, an auditor, honest reversibility, evidence sold separately, and elan1 owning the write. A gate scored “probably” is scored fail.', '#/packs'],
    ['Gate (roadmap)', 'roadmap', 'G1 to G6: observable conditions that release a level or a pack. The site shows gates and conditions, not dates.', '#/roadmap'],
    ['Governed action', 'pricing', 'The unit that is permitted, executed, recorded and billed — the same unit at all four points. One row in the chain, one meter event, one invoice line.', '#/pricing'],
    ['Guardrail', 'rungs', 'Rung 5: allow-lists first, then the blast-radius check. Not prompt filtering.', '#/product/how-it-works'],
    ['KernelPort', 'developers', 'The single seam between anything that wants to change a system of record and the thing that decides whether it may. Six calls: define, assert, seal, verify, scope, refuse.', '#/developers/kernelport'],
    ['Lexicon hash', 'evidence', 'Field 15 of the record: a digest over the term set a declaration references, so “credit limit” means in 2033 what it meant on the day.', '#/evidence'],
    ['Limits statement', 'evidence', 'What a PASS does not establish, in the profile’s own words, printed in every report. Shown unprompted.', '#/packs/ledger1'],
    ['MCA Rule 3(1) and 11(g)', 'regulation', 'The Companies (Accounts) Rules audit-trail requirement in force since 1 April 2023, and the auditor’s duty to report on it. The hook ledger1 is built on.', '#/packs/ledger1'],
    ['Meter', 'pricing', 'Rung 9: one event per governed action, with the basis taken from the declared blast radius. Refusals at quantity zero, enforced by a database constraint.', '#/pricing'],
    ['Not done', 'outcomes', 'A refusal on screen: “Not done — {plain reason}”, the numbers, one next action, and the code once in small type. A correct, free outcome, not an error.', '#/work/not-done/4108'],
    ['Obligation', 'work', 'Created at rung 6 on escalation: the write, the autonomy level that triggered it, an expiry and the resolver set. Obligation ids look like OB-2026-0412.', '#/work/approvals'],
    ['Offline verifier', 'evidence', 'elan1-verify: reads the bundle, the profile and a fingerprint you obtained out of band. No network, no API, no shared code with the chain writer. Free, as source, to anyone.', '#/verify'],
    ['Pack', 'packs', 'One declaration, one certified verifier profile and one regime-specific export mapping, aimed at one buyer with one auditor under one dated obligation. Configuration, never a fork or a brand.', '#/packs'],
    ['Platform failure', 'outcomes', 'Our failure, not a rule: a PLATFORM.* code, not billed, and we are paged. Never shown as a policy refusal.', '#/developers/refusals'],
    ['Pre-gates', 'gates', 'Rung 3: G1 consent, G2 residency, G3 retention, G4 dual control, G5 rate, G6 budget, G7 counterparty, G8 schedule, G9 precondition. Six are never skippable.', '#/product/how-it-works'],
    ['Precedent', 'agents', 'A computation over one tenant’s own chain — “this write resembles forty earlier writes, three of which were refused”. A record, not a prediction. Nothing crosses a tenant boundary.', '#/agents/graduation'],
    ['Proof record', 'evidence', 'The sixteen-field hash-chained record written at rung 8, for commits and refusals alike. Its human handle is the sequence number, such as #4,101.', '#/assurance/proof/4101'],
    ['Refusal code', 'outcomes', 'A member of a closed register of 43 codes — policy 14, gate 19, platform 10 — of which 28 are active at L1. HTTP 200, a full record, metered at zero.', '#/developers/refusals'],
    ['Resolver set', 'work', 'The people who may resolve an obligation. People only — an agent may never approve.', '#/agents/people'],
    ['Reversal plan', 'declaration', 'target_native_undo, compensating_instrument or snapshot restore, with a window — or irreversible: true. “Reverse this” is itself a governed write.', '#/work/reverse/4101'],
    ['RFC 3161', 'standards', 'The IETF trusted-timestamping standard. The authority sees only a hash and a nonce, and the token can be checked offline for ever.', '#/evidence'],
    ['Right Path', 'rungs', 'The one write function: 0b STOP, then IDENTITY, WRITE DOOR, PRE-GATES, evaluate(), GUARDRAIL, AUTONOMY, ACT, PROOF, METERED. Eight of the ten checks make no model call.', '#/product/right-path'],
    ['Sandbox key', 'developers', 'A self-serve developer credential for an isolated sandbox tenant with synthetic fixtures. Every meter event is quantity zero. Production keys are never self-serve.', '#/developers/sandbox-key'],
    ['Seal', 'evidence', 'elan1.proof.seal.v6: the frozen sixteen-field record and its digest. There is no v6.1 and no seventeenth field.', '#/developers/seal'],
    ['Selective disclosure', 'evidence', 'Revealing three fields to one recipient and five to another from one record. Withheld is not missing, and missing is not altered. An L3 capability.', '#/assurance-levels'],
    ['Shadow sandbox', 'rungs', 'The mechanism inside every write, production included: snapshot, sandbox apply, gate re-run, then identical bytes to live.', '#/product/how-it-works'],
    ['Single writer', 'rungs', 'Exactly one process mutates the target system per tenant, with a single-use credential that lives ten minutes. What makes the absence of a receipt into evidence.', '#/product/how-it-works'],
    ['Tamper-evident', 'evidence', 'The honest word for a hash-chained log: an alteration is detectable. We use it instead of stronger words we cannot yet support.', '#/security'],
    ['Timestamp authority', 'evidence', 'The independent party that issues an RFC 3161 token. Every batch is anchored by two, one India-based, from different operators and trust roots.', '#/evidence'],
    ['Verifier profile', 'evidence', 'Turns one regulatory regime into a machine-checkable claim. Never certified by its own author. Priced per regime; the verifier itself is free.', '#/packs/ledger1'],
    ['Write intent', 'rungs', 'A request, never a permission. A model may produce one. It may never produce an allow.', '#/product/right-path'],
    ['Write type', 'declaration', 'A declared kind of change, such as erp.sales_invoice.submit, with a blast radius, ordered gates and exactly one of a reversal plan or irreversible: true. There is no generic write.', '#/records/write-types/erp.sales_invoice.submit']
  ];

  D.status = {
    components: [
      { id: 'kernel', name: 'Kernel API /v1', desc: 'assert, define, verify and scope. Latency envelope shown only when measured.', state: 'good', uptime: '99.97%', incidents: { 71: 'critical', 34: 'warning' } },
      { id: 'mcp', name: 'MCP surface', desc: '34 tools across ro, stage and act scopes.', state: 'good', uptime: '99.99%', incidents: { 71: 'serious' } },
      { id: 'sandbox', name: 'Sandbox provisioning', desc: 'Self-serve sandbox tenants and sandbox keys. Target p95 under 60 seconds.', state: 'good', uptime: '99.92%', incidents: { 13: 'warning', 12: 'warning' } },
      { id: 'chain', name: 'Chain integrity', desc: 'Its own component. Flipped by a missed nightly integrity job, without anybody pressing anything.', state: 'good', uptime: '99.73%', incidents: { 21: 'serious' } },
      { id: 'meter', name: 'Meter pipeline', desc: 'Meter lag p99 target ≤ 30 s. Invoices never issue over an unreconciled period.', state: 'good', uptime: '99.95%', incidents: { 52: 'warning' } },
      { id: 'console', name: 'Console', desc: 'The Four Doors: Work, Records, Agents, Assurance.', state: 'good', uptime: '100%', incidents: {} },
      { id: 'verifier', name: 'Verifier release channel', desc: 'Source, SHA256SUMS and release signatures for elan1-verify.', state: 'good', uptime: '100%', incidents: {} },
      { id: 'tsa-a', name: 'Anchoring — authority A', desc: 'Not in service. Anchoring arrives with L2 Attested at gate G4. “Unanchored” is a stated property, not an outage.', state: 'none', uptime: null, incidents: {} },
      { id: 'tsa-b', name: 'Anchoring — authority B (India)', desc: 'Not in service. Arrives with L2 Attested at gate G4.', state: 'none', uptime: null, incidents: {} }
    ],
    incidents: [
      { id: 'INC-2026-014', title: 'Sandbox provisioning slower than target', sev: 'warning', comp: 'Sandbox provisioning', start: '11 Sep 2026, 10:42 IST', end: '11 Sep 2026, 13:05 IST', dur: '2h 23m', day: 13,
        summary: 'New sandbox tenants took up to 4 minutes to provision against a 60-second p95 target. Existing sandboxes and all writes were unaffected.',
        timeline: [['10:42 IST', 'Alert: sandbox provisioning p95 above 60 s for 10 minutes.', 'warning'], ['10:51 IST', 'Investigating. Fixture seeding for the reference tenant is queueing behind a declaration compile job.', 'info'], ['12:20 IST', 'Compile jobs moved to their own queue. p95 recovering.', 'info'], ['13:05 IST', 'Resolved. p95 back under target for 30 minutes.', 'good']],
        impact: [['Writes affected', '0'], ['Sandbox tenants delayed', '17'], ['Proof records affected', '0'], ['Billed', '₹0 — sandbox meters at quantity zero']],
        cause: 'Fixture seeding shared a worker queue with declaration compilation. A large compile blocked seeding.', actions: ['Separate queues for seeding and compilation (done).', 'Alert on queue depth, not only on p95 (done).', 'Load test provisioning at 10× current daily volume before L1 general availability (open).'] },
      { id: 'INC-2026-013', title: 'Nightly chain-integrity job missed its window', sev: 'serious', comp: 'Chain integrity', start: '3 Sep 2026, 02:10 IST', end: '3 Sep 2026, 08:02 IST', dur: '5h 52m', day: 21,
        summary: 'The 02:10 IST integrity job did not run. Chain integrity flipped to “not checked” automatically for seq 3,882–4,020 on the reference tenant. Nothing was altered; the re-run at 07:40 IST read continuous.',
        timeline: [['02:10 IST', 'Scheduled integrity job did not start. Chain integrity flipped to “not checked over seq 3,882–4,020”.', 'serious'], ['06:55 IST', 'On-call acknowledged. The scheduler lost its lease after a node rotation.', 'info'], ['07:40 IST', 'Job re-run manually. Result: continuous · seq 1–4,020 · 23 of 23 write types.', 'good'], ['08:02 IST', 'Resolved. Component restored to operational.', 'good']],
        impact: [['Writes affected', '0'], ['Range not checked', 'seq 3,882–4,020 for 5h 30m'], ['Break found', 'None'], ['Billed', '₹0']],
        cause: 'The scheduler lease was not re-acquired after a planned node rotation. The page fired, but at a low urgency that did not wake the on-call.', actions: ['A missed integrity run pages at high urgency (done).', 'Lease health is its own check (done).', 'Publish the not-checked range on this page automatically (done — this incident is the first).'] },
      { id: 'INC-2026-012', title: 'Rule engine unavailable — writes refused as our failure', sev: 'critical', comp: 'Kernel API /v1', start: '14 Jul 2026, 16:31 IST', end: '14 Jul 2026, 16:38 IST', dur: '7m', day: 71,
        summary: 'For seven minutes the kernel returned PLATFORM.POLICY_UNAVAILABLE. Every affected write was refused as a platform failure — never allowed by default — and none was billed.',
        timeline: [['16:31 IST', 'Policy evaluation timeouts. Kernel returns PLATFORM.POLICY_UNAVAILABLE; paged.', 'critical'], ['16:34 IST', 'Cause identified: a policy cache warm-up after deploy exceeded its memory limit.', 'info'], ['16:38 IST', 'Rolled back to the previous release. Writes resumed.', 'good'], ['17:10 IST', 'Callers retried with the same intent id. No duplicates.', 'good']],
        impact: [['Writes refused as our failure', '38 (sandbox)'], ['Writes allowed by default', '0 — the kernel fails closed'], ['Billed', '₹0'], ['Duplicate writes after retry', '0']],
        cause: 'A release increased policy compilation memory. The warm-up exceeded the container limit and restarted in a loop.', actions: ['Memory budget test for policy compilation in CI (done).', 'Canary deploys in the Tuesday and Thursday 21:00–23:00 IST window only (done).'] },
      { id: 'INC-2026-011', title: 'Meter lag above target', sev: 'warning', comp: 'Meter pipeline', start: '2 Aug 2026, 11:15 IST', end: '2 Aug 2026, 12:02 IST', dur: '47m', day: 52,
        summary: 'Meter events reached the ledger up to 3 minutes late against a 30-second p99 target. No event was lost; reconciliation that night was clean in both directions.',
        timeline: [['11:15 IST', 'Meter lag p99 above 30 s.', 'warning'], ['11:40 IST', 'Consumer scaled from 2 to 4.', 'info'], ['12:02 IST', 'Resolved.', 'good']],
        impact: [['Meter events lost', '0'], ['Reconciliation', 'Clean, both directions'], ['Invoices affected', 'None issued in the period']],
        cause: 'A sandbox load test by a design partner produced 6× normal event volume.', actions: ['Autoscale the meter consumer on lag (done).'] }
    ]
  };

  D.changelog = [
    { train: '2026.09', date: '22 Sep 2026', cls: 'additive', surface: 'Console', title: 'Decide shows every declared gate, not only failures', body: 'An approver who presses Approve has already seen the diff, the gate results and the policy version. The Decide screen now lists all seven gates for erp.sales_invoice.submit in declared order.' },
    { train: '2026.09', date: '18 Sep 2026', cls: 'fix', surface: 'Specification', title: 'Seal test vector TV-001 re-stated', body: 'The 311-octet preimage figure was computed against a superseded encoding table and is retired. The preimage is 329 octets. The replacement digest is not written down until two independent implementations produce it and agree.' },
    { train: '2026.09', date: '9 Sep 2026', cls: 'additive', surface: 'Status', title: 'Chain integrity is its own status component', body: 'A missed nightly integrity job flips the component to “not checked” with the range, automatically.' },
    { train: '2026.08', date: '28 Aug 2026', cls: 'breaking', surface: 'Declaration schema', title: 'Block 7 renamed from doors to channels', body: 'Declarations using block_doors are rejected from the next schema major. Notice period: 90 days internal, 12 months external. Decision DR-012.' },
    { train: '2026.08', date: '14 Aug 2026', cls: 'additive', surface: 'Refusal register', title: 'Register closed at 43 codes in three classes', body: 'Policy 14, gate 19, platform 10. Twenty-eight are active at L1. Every code maps to one rung, one class and one operator action.' },
    { train: '2026.07', date: '30 Jul 2026', cls: 'fix', surface: 'Competitive matrix', title: 'elan1’s own per-action record re-scored from “Designed” to No', body: 'Decision DR-010: designed scores zero. Our row now reads No in every column that matters, because nothing is in production.' },
    { train: '2026.07', date: '21 Jul 2026', cls: 'additive', surface: 'KernelPort', title: 'KernelPort v1 frozen: six calls', body: 'define · assert · seal · verify · scope · refuse. Identical for every consumer, in every product, at every assurance level.' }
  ];

  D.roles = [
    { id: 'kernel-engineer', title: 'Kernel engineer — second seal implementation', team: 'Kernel', where: 'Coimbatore or Chennai', what: 'Write the second, independent implementation of elan1.proof.seal.v6 from the specification text alone, with no shared code and no shared channel with the first.', done: 'Both implementations agree on all 64 vectors. Where they disagree, you fix the text first.' },
    { id: 'product-designer', title: 'Product designer — the Four Doors', team: 'Product', where: 'Chennai', what: 'Own Work, Records, Agents and Assurance as templates rendered from a Declaration, not bespoke screens.', done: 'An approver who presses Approve has already seen the diff, the gate results and the policy version.' },
    { id: 'solutions-engineer', title: 'Solutions engineer — ERPNext and Tally', team: 'Field', where: 'Coimbatore', what: 'Take a design partner from sandbox key to a first real governed write in their own site.', done: 'A bypass attempt is shown failing, in front of the customer.' },
    { id: 'assurance-lead', title: 'Assurance lead (chartered accountant)', team: 'Assurance', where: 'Chennai', what: 'Run the ledger1 pilot with a statutory auditor: the 90-day protocol, the verifier run on their machine, and the day-80 verdict.', done: 'The auditor states unprompted what a PASS does not establish.' },
    { id: 'security-engineer', title: 'Security and residency engineer', team: 'Platform', where: 'Coimbatore or Chennai', what: 'Own the go-live bar: Mumbai residency, key custody, restore drills and the six-hour CERT-In path.', done: 'Every row in the minimum bar is ticked and evidenced before the first external user.' }
  ];

  D.subprocessors = [
    ['Amazon Web Services', 'Compute, database, key management, backups for tenant data', 'ap-south-1 (Mumbai), three zones', 'Cloud services agreement', 'Proposed', 'Primary hosting. No data outside India.'],
    ['Anthropic', 'Model calls at rung 4 (evaluate) where a declaration permits, and console explanations for a human reader', 'To be confirmed in writing before go-live', 'Commercial terms', 'Proposed', 'elan1 is built on Claude. No model is in the decision or graduation path.'],
    ['Timestamp authority A', 'A hash and a nonce only — never a record, payload or tenant name', 'Outside India (different operator and trust root)', 'Not yet contracted', 'Not yet contracted', 'Arrives with L2 Attested.'],
    ['Timestamp authority B', 'A hash and a nonce only', 'India', 'Not yet contracted', 'Not yet contracted', 'Arrives with L2 Attested. One authority must be India-based.'],
    ['Transactional email provider', 'Approver e-mail notifications: name, e-mail address, a deep link', 'India region required', 'Not yet selected', 'Not yet selected', 'Notification plus deep link only — nothing is approvable by e-mail.']
  ];

  D.industries = [
    { t: 'Manufacturers on ERPNext', who: 'Textiles, auto components, engineering. ₹5–50 crore turnover.', what: 'Sales and purchase invoices, payments, journals and customer credit terms, under the MCA audit-trail rule.', pack: 'ledger1', st: 'spec', sample: 'The sample tenant on this site, Kaveri Spinning Mills (Tiruppur), is configured this way.' },
    { t: 'Distributors and traders above the e-invoicing threshold', who: 'Firms that must register every B2B invoice.', what: 'The write that requests an invoice reference, with the 24-hour cancellation window declared honestly.', pack: 'invoice1', st: 'spec', sample: null },
    { t: 'Lenders and their collections partners', who: 'Banks and NBFCs with an early-bucket book.', what: 'Who may be called, when, by which script; promises taken inside a band; recordings hashed from the capture point.', pack: 'collect1', st: 'sketch', sample: 'Attested advisory where the lender’s core system owns the write.' },
    { t: 'Chartered accountancy practices', who: 'CA firms carrying Rule 11(g) for their clients.', what: 'Introduce, implement or verify for many client tenants — without speaking to a regulator for us.', pack: null, st: 'spec', sample: 'See the partner programme.' },
    { t: 'Insurers', who: 'Following the IRDAI working group constituted 18 June 2026.', what: 'Claims and underwriting writes. Watch row only — never shown as engaged.', pack: null, st: 'reserved', sample: null },
    { t: 'Healthcare providers', who: 'ABDM-connected providers.', what: 'Demand-led. Reserved, not built.', pack: null, st: 'reserved', sample: null },
    { t: 'Banks (core systems)', who: 'Where the write lands in a core banking system.', what: 'Reserved, not built.', pack: null, st: 'reserved', sample: null },
    { t: 'Real estate developers', who: 'Demand-led.', what: 'Reserved, not built.', pack: null, st: 'reserved', sample: null },
    { t: 'Telecom operators', who: 'Demand-led.', what: 'Reserved, not built.', pack: null, st: 'reserved', sample: null },
    { t: 'Government departments', who: 'Demand-led.', what: 'Reserved, not built.', pack: null, st: 'reserved', sample: null }
  ];

  /* ------------------------------------------------------------------------
     Shared product specimens (built from the real components)
     ------------------------------------------------------------------------ */
  var H = {
    h4101: '9a51354948ef61d10149fa91ad1bf6a8676f94e7d6f2b0f7d1920797b8fb2c7e',
    h4100: '4c0869898c7bb333c6ad353c482fcc8f9603ededb2760f3f055096b25fe6f93d',
    h4099: 'b7f2efbcc6e235db0bb4ee5503f6b0fd9ff7c45e935efe567961e023cca70e61',
    h4098: '1e9ccae3f2d4f75f1834c9fbd1d2a0c7a67ae6d7cf14caf6505e649c547f83a5',
    h4097: '64ab95807b29ae7ff1c03c14d0267e98e409936df46dbf7b8764329fbd90d2f0'
  };
  var GATES_4101 = [
    { id: 'G1', name: 'Consent', result: 'passed', words: 'Recorded consent covers invoicing for ACME Textiles; expires 31 Mar 2027.' },
    { id: 'G2', name: 'Residency (Mumbai)', result: 'passed', words: 'Record and tenant are both in residency domain in · Mumbai.' },
    { id: 'G3', name: 'Retention', result: 'passed', words: 'The invoice is inside its 8-year retention window.' },
    { id: 'G7', name: 'Counterparty (ACME Textiles, known)', result: 'passed', words: 'Registered customer with a validated GSTIN.' },
    { id: 'G9', name: 'Precondition', result: 'passed', words: 'Credit limit ₹3,00,000; exposure after this write ₹2,88,000.' },
    { id: 'G4', name: 'Dual control', result: 'passed', words: 'Above ₹2,00,000, so a second named person is required: Venkat Raman (ar-approvers).' },
    { id: 'G6', name: 'Budget', result: 'passed', words: '212 of 400 drafts declared for September used.' }
  ];
  var DIFF_4101 = [
    { field: 'Invoice status', before: 'Draft', after: 'Submitted', material: true },
    { field: 'ACME Textiles outstanding', before: '₹48,000', after: '₹2,88,000', material: true, mono: true },
    { field: 'e-Invoice IRN', before: '', after: 'Requested' },
    { field: 'Due date', before: '', after: '24 Oct 2026' },
    { field: 'Grand total', before: '₹2,40,000', after: '₹2,40,000', mono: true }
  ];
  var pv = { state: 'open' }; // home preview: open | approved | rejected

  function decideCard(o) {
    o = o || {};
    var st = pv.state;
    if (o.noActions) st = 'static';
    var actions = st === 'static' ? '<p class="e1-caption e1-muted">Approve and Reject appear here for people in ar-approvers. Reject needs a sentence.</p>' : st === 'open'
      ? '<div class="e1-row" style="gap:16px;flex-wrap:wrap">' + c.button('Reject', { kind: 'danger', icon: 'reject', attrs: 'data-action="site-pv-reject"' }) + c.button('Approve and commit', { kind: 'gate', attrs: 'data-action="site-pv-approve"' }) + '</div>'
      : st === 'approved'
        ? '<div class="e1-row" style="gap:10px;flex-wrap:wrap">' + c.outcome('committed') + '<span class="e1-caption">Approved by Venkat Raman · recorded as #4,100 · committed as #4,101</span><a class="e1-caption" href="' + esc(here()) + '" data-action="site-pv-reset">Reset preview</a></div>'
        : '<div class="e1-row" style="gap:10px;flex-wrap:wrap">' + c.outcome('refused', { code: 'POLICY.APPROVAL_DECLINED' }) + '<span class="e1-caption">Rejected with a reason · nothing was written · ₹0</span><a class="e1-caption" href="' + esc(here()) + '" data-action="site-pv-reset">Reset preview</a></div>';
    return c.card({ body: '<div class="e1-stack">' +
      '<div class="e1-row e1-row--between e1-row--top" style="flex-wrap:wrap;gap:8px"><div><p class="e1-label">OB-2026-0412 · erp.sales_invoice.submit</p><p class="e1-text-section" style="margin-top:4px;font-weight:600">Submit invoice SINV-2026-01187 · ACME Textiles · ₹2,40,000</p></div>' + (st === 'open' || st === 'static' ? c.countdown(E1.ahead(192), { label: 'Expires' }) : '') + '</div>' +
      '<div class="e1-row" style="gap:16px;flex-wrap:wrap">' + c.actor({ name: 'ar-agent', kind: 'agent', role: 'A2 Propose' }) + c.blast(2, { compact: !!o.compact }) + c.reversible('24 h') + '</div>' +
      c.diff(DIFF_4101, { caption: 'Field-level changes proposed by this write' }) +
      (o.compact ? '<p class="e1-caption">' + c.badge('good', '7 of 7 gates passed') + ' <span class="e1-muted">erp.ar v7 · policy v11</span></p>' : c.gates(GATES_4101, { version: 'erp.ar v7 · policy v11' })) +
      '<p class="e1-caption e1-muted">evaluate() returned allow at policy version 11. ar-agent holds A2 Propose, so a person approves before anything is written. You are in ar-approvers.</p>' +
      actions + '</div>' });
  }
  function seal4101() {
    return c.seal({ level: 'L1', seq: 4101, writeType: 'erp.sales_invoice.submit', outcome: 'committed', blast: 2, reversible: '24 h', amount: 240000,
      actor: { name: 'ar-agent', kind: 'agent' }, approver: 'Venkat Raman', at: '24 Sep 2026, 15:02 IST', digest: H.h4101, prev: H.h4100, declaration: 'erp.ar v7', policy: 'policy v11' });
  }
  function refusal4098() {
    return c.refusal({ code: 'GATE.PRECONDITION_FAILED', title: 'Not done — credit limit', ruleName: 'Customer credit limit', version: 'erp.ar v7', rule: 'An invoice may not take a customer above their credit limit.',
      numbers: [{ label: 'Credit limit', value: '₹3,00,000' }, { label: 'Exposure after this invoice', value: '₹4,20,000' }],
      change: 'Reduce the invoice by ₹1,20,000, or request a limit change.', action: { label: 'Request a limit change', href: '#/work/request/erp.credit_limit.change' }, proofHref: '#/assurance/proof/4098', at: '24 Sep 2026, 14:07 IST · #4,098' });
  }
  function invoiceSnippet() {
    return '<div class="e1s-inv"><div class="e1s-inv__h"><span><b style="color:var(--text-primary)">Invoice · one month</b> · L2 Attested tenant (sample)</span>' + prov('MODELLED') + '</div>' +
      '<table><caption class="e1-sr">Sample monthly invoice</caption><tbody>' +
      '<tr><th scope="row">Platform floor<small>₹6,00,000 a year ÷ 12</small></th><td>' + inr(50000) + '</td></tr>' +
      '<tr><th scope="row">Governed actions 2,50,000<small>1,25,000 included · 1,25,000 × ₹1.20</small></th><td>' + inr(150000) + '</td></tr>' +
      '<tr><th scope="row">Regulatory pack · <span class="e1s-mono">ledger1</span></th><td>' + inr(11250) + '</td></tr>' +
      '<tr><th scope="row">Verifier profile · <span class="e1s-mono">in-mca-audit-trail</span></th><td>' + inr(25000) + '</td></tr>' +
      '<tr class="is-zero"><th scope="row">412 refused<small>Metered at quantity zero · each one opens its record</small></th><td>₹0</td></tr>' +
      '<tr class="is-total"><th scope="row">Total</th><td>' + inr(236250) + '</td></tr></tbody></table></div>';
  }

  /* ------------------------------------------------------------------------
     The Right Path, animated (home) — three outcomes of the same write type
     ------------------------------------------------------------------------ */
  var RP = { scn: 'committed', step: -1, timer: null, keep: false };
  function rpOrder(scn) {
    var all = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    if (scn === 'refused') return [0, 1, 2, 3, 8, 9];
    if (scn === 'escalated') return [0, 1, 2, 3, 4, 5, 6, 8, 9];
    return all;
  }
  function rpHtml() {
    var sc = D.scenarios;
    var btns = ['committed', 'refused', 'escalated'].map(function (k) {
      return '<button type="button" data-action="site-rp-scn" data-value="' + k + '" aria-pressed="' + (RP.scn === k) + '">' + esc(sc[k].label) + ' <span class="e1s-mono e1-muted">#' + num(sc[k].seq) + '</span></button>';
    }).join('');
    var rungs = D.rungs.map(function (r, i) {
      return '<li class="e1s-rung is-wait' + (r[5] ? ' e1s-rung--kernel' : '') + '" data-i="' + i + '"><span class="e1s-rung__n"><span>' + esc(r[0]) + '</span></span>' +
        '<span class="e1s-rung__name">' + esc(r[1]) + '</span><span class="e1s-rung__job">' + esc(r[6]) + '</span><span class="e1s-rung__st" aria-live="off">Waiting</span></li>';
    }).join('');
    return '<div class="e1s-rp" id="e1s-rp">' +
      '<div class="e1s-rp__bar"><div class="e1s-rp__scn" role="group" aria-label="Choose an outcome">' + btns + '</div>' +
      '<div class="e1s-rp__ctl">' + c.button('Step', { kind: 'secondary', icon: 'skip', attrs: 'data-action="site-rp-step"' }) + c.button('Replay', { kind: 'secondary', icon: 'refresh', attrs: 'data-action="site-rp-play"' }) + '</div></div>' +
      '<ol class="e1s-path" aria-label="The Right Path: ten checks in one order">' + rungs + '</ol>' +
      '<div class="e1s-rp__out"><ol class="e1s-log" id="e1s-rp-log" aria-label="What each check wrote"></ol><div id="e1s-rp-res" aria-live="polite"></div></div></div>';
  }
  function rpPaint() {
    var root = document.getElementById('e1s-rp'); if (!root) return false;
    var scn = D.scenarios[RP.scn], order = rpOrder(RP.scn), step = RP.step, done = step >= order.length;
    root.querySelectorAll('.e1s-rung').forEach(function (li) {
      var i = Number(li.getAttribute('data-i')), r = D.rungs[i], pos = order.indexOf(i), cls = 'is-wait', word = 'Waiting', icon = '';
      var entry = scn.log[r[0]];
      if (pos !== -1 && pos < step) {
        var k = entry ? entry[0] : 'ok';
        if (k === 'no') { cls = 'is-fail'; word = 'Not done'; icon = 'x'; }
        else if (k === 'esc') { cls = 'is-esc'; word = 'Waiting on a person'; icon = 'gate'; }
        else if ((i === 8 || i === 9) && RP.scn !== 'committed') { cls = 'is-pass is-rec'; word = i === 8 ? 'Recorded' : 'Metered at ₹0'; icon = 'check'; }
        else { cls = 'is-pass'; word = 'Passed'; icon = 'check'; }
      } else if (pos !== -1 && pos === step) { cls = 'is-now'; word = 'Checking'; icon = 'clock'; }
      else if (pos === -1 && (done || step >= order.indexOf(8))) { cls = 'is-skip'; word = 'Not reached'; icon = 'minus'; }
      li.className = 'e1s-rung ' + cls + (r[5] ? ' e1s-rung--kernel' : '');
      li.querySelector('.e1s-rung__st').innerHTML = (icon ? ic(icon, 12) : '') + '<span>' + esc(word) + '</span>';
    });
    var log = document.getElementById('e1s-rp-log');
    if (log) {
      var lines = order.slice(0, Math.max(0, Math.min(step, order.length))).map(function (i, n) {
        var r = D.rungs[i], e = scn.log[r[0]] || ['ok', ''];
        var cl = e[0] === 'no' ? 'no' : e[0] === 'esc' ? 'esc' : 'ok';
        return '<li class="' + (n === step - 1 ? 'is-new' : '') + '"><span class="k">' + esc(r[0]) + '</span><span class="' + cl + '">' + esc(r[1]) + '</span><span class="v">' + esc(e[1]) + '</span></li>';
      });
      if (!lines.length) lines = ['<li><span class="k">··</span><span class="k">write intent</span><span class="v">erp.sales_invoice.submit · ACME Textiles · ' + (RP.scn === 'refused' ? '₹4,20,000' : '₹2,40,000') + '</span></li>'];
      log.innerHTML = lines.join('');
    }
    var res = document.getElementById('e1s-rp-res');
    if (res) {
      if (!done) { res.innerHTML = '<div class="e1s-card" style="height:100%"><p class="e1s-eyebrow" style="margin:0">A model may produce a write intent</p><p class="e1s-h4">It may never produce an allow.</p><p class="e1s-card__d">Every governed write climbs the same ten checks in the same order, and each one leaves a row behind. Only evaluate() may call a model, and never to decide.</p></div>'; }
      else if (RP.scn === 'committed') res.innerHTML = '<div class="e1s-card" style="height:100%">' + c.outcome('committed') + '<p class="e1s-h4">' + esc(scn.title) + '</p><p class="e1s-card__d">One row in the chain, one meter event, one invoice line. Reverse this is available for 24 hours, and is itself a governed write.</p><a class="e1s-card__foot" href="#/assurance/proof/4101">Open proof #4,101 ' + ic('arrow-right', 14) + '</a></div>';
      else if (RP.scn === 'refused') res.innerHTML = '<div class="e1s-card" style="height:100%">' + c.outcome('refused', { code: 'GATE.PRECONDITION_FAILED' }) + '<p class="e1s-h4">Not done — credit limit</p><p class="e1s-card__d">HTTP 200, a full sixteen-field record with a zeroed record id, and a meter event of quantity zero. Two next actions: reduce the invoice, or request a limit change — itself a governed write.</p><a class="e1s-card__foot" href="#/work/not-done/4108">See a refusal in the console ' + ic('arrow-right', 14) + '</a></div>';
      else res.innerHTML = '<div class="e1s-card" style="height:100%">' + c.outcome('escalated') + '<p class="e1s-h4">OB-2026-0412 is waiting on a person</p><p class="e1s-card__d">The ladder stops at rung 6. A named resolver set — people only — has four hours. Nothing is written until one of them decides.</p><a class="e1s-card__foot" href="#/work/decide/OB-2026-0412">Open the Decide screen ' + ic('arrow-right', 14) + '</a></div>';
    }
    return true;
  }
  function rpStop() { if (RP.timer) { clearInterval(RP.timer); RP.timer = null; } }
  function rpPlay(fromStart) {
    rpStop();
    var order = rpOrder(RP.scn);
    if (fromStart) RP.step = 0;
    var reduce = false; try { reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) { }
    if (reduce) { RP.step = order.length; rpPaint(); return; }
    rpPaint();
    RP.timer = setInterval(function () {
      RP.step++;
      if (!rpPaint() || RP.step >= order.length) rpStop();
    }, 620);
  }
  E1.action('site-rp-scn', function (el) { RP.scn = el.getAttribute('data-value'); document.querySelectorAll('[data-action="site-rp-scn"]').forEach(function (b) { b.setAttribute('aria-pressed', String(b === el)); }); rpPlay(true); });
  E1.action('site-rp-play', function () { rpPlay(true); });
  E1.action('site-rp-step', function () { rpStop(); var n = rpOrder(RP.scn).length; RP.step = RP.step >= n ? 0 : RP.step + 1; rpPaint(); });

  /* Home preview interactions */
  E1.action('site-pv-approve', function () {
    pv.state = 'approved'; RP.keep = true; E1.render({ keepScroll: true });
    E1.toast('Approved. Posted. Proof #4,101.', 'good', { title: 'Sample preview', action: { label: 'Open the proof', href: '#/assurance/proof/4101' } });
    E1.announce('Approved. Posted. Proof 4101.');
  });
  E1.action('site-pv-reject', function () {
    var id = E1.uid('rj');
    E1.modal({ title: 'Reject this invoice?', eyebrow: 'OB-2026-0412 · sample preview',
      body: '<p class="e1-muted" style="margin:0 0 12px">Your reason is recorded with the decision and shown to the proposer. Nothing is written.</p>' + c.field('Reason', c.textarea({ id: id, rows: 3, describedBy: id + '-msg', placeholder: 'For example: ACME Textiles has an open dispute on SINV-2026-01102.' }), { id: id, required: true, help: 'At least one sentence (12 characters or more).' }),
      actions: [{ label: 'Cancel', kind: 'ghost' }, { label: 'Reject', kind: 'danger', onClick: function (e, close, el) {
        var ta = el.querySelector('#' + id), v = (ta && ta.value || '').trim();
        if (v.length < 12) {
          ta.setAttribute('aria-invalid', 'true');
          var m = el.querySelector('#' + id + '-msg'); if (m) { m.textContent = 'An honest rejection needs a sentence. Add at least 12 characters.'; m.classList.add('e1-field__error'); }
          ta.focus(); return false;
        }
        pv.state = 'rejected'; close(); RP.keep = true; E1.render({ keepScroll: true });
        E1.toast('Rejected. Nothing was written. The reason is on the record.', 'neutral', { title: 'Sample preview' });
      } }] });
  });
  E1.action('site-pv-reset', function () { pv.state = 'open'; RP.keep = true; E1.render({ keepScroll: true }); });

  /* ------------------------------------------------------------------------
     HOME  #/
     ------------------------------------------------------------------------ */
  function homeHero() {
    return '<section class="e1s-hero" aria-labelledby="e1s-home-h">' +
      '<span class="e1s-hero__disc" aria-hidden="true"></span><span class="e1s-hero__diag" aria-hidden="true"></span>' +
      wrap('<div class="e1s-hero__in"><div class="e1s-hero__text">' +
        '<p class="e1s-hero__kicker">Every other company in this market watches what an AI agent did.</p>' +
        '<h1 class="e1s-hero__h1" id="e1s-home-h">elan1 stands between the agent and the system of record.</h1>' +
        '<div class="e1s-hero__rule"><p>A model may produce a write intent. It may never produce an allow.</p><small>elan1 decides whether each write is permitted, puts a named person in front of the ones that need one, executes it through a single writer and records it — refusals included, at ₹0.</small></div>' +
        '<div class="e1s-hero__cta"><a class="e1s-btn e1s-btn--paper" href="#/demo">Book a working session ' + ic('arrow-right', 16) + '</a><a class="e1s-btn e1s-btn--line" href="#/verify">Verify a record</a>' +
        '<a class="e1s-btn e1s-btn--text" href="#/developers">Developers ' + ic('arrow-up-right', 14) + '</a><a class="e1s-btn e1s-btn--text" href="#/auth/sign-in">Sign in</a></div>' +
        '<div class="e1s-hero__strip"><span><b>L1 Guarded</b> · building</span><span><b>Pre-revenue</b> · no customer yet</span><span><b>Mumbai</b> residency</span><span>Built on <b>Claude</b></span></div>' +
      '</div></div>') + '</section>';
  }

  function homeProblem() {
    return band({ id: 'problem', tone: 'paper', eyebrow: 'The problem',
      title: 'An agent’s write is the only consequential act nobody can prove.',
      lead: 'An agent posts a journal entry, releases a payment, amends a credit limit. That write lands in a system of record and affects a third party who was not in the room. The tooling built around agents watches it: it scores outputs, traces tool calls and offers a kill switch. None of it stands at the moment of consequence — and every audit trail sold today is written by the party whose conduct it records.',
      body: '<div class="e1s-stats">' +
        stat('63<small>%</small>', 'of enterprises cannot enforce purpose limits on an agent.', prov('PUBLISHED') + ' CSA / Token Security, 21 Apr 2026') +
        stat('60<small>%</small>', 'cannot stop one.', prov('PUBLISHED') + ' Same survey') +
        stat('67<small>%</small>', 'have no evidence-quality audit trail.', prov('PUBLISHED') + ' Same survey') +
        stat('18<small>%</small>', 'of Indian regulated entities maintained audit logs.', prov('PUBLISHED') + ' RBI FREE-AI survey, 13 Aug 2025') + '</div>' +
        '<div class="e1s-split" style="margin-top:48px"><div>' + quote('Those are three gaps: a policy gate, a single writer and a receipt.') + '</div>' +
        '<div class="e1s-stack"><p class="e1s-p">MCA Rule 3(1) and Rule 11(g) have applied since 1 April 2023 to about 1.85 million companies. The audit trail must record when a change occurred, who made it and what changed; it must not be disabled and must be kept for eight years. When an agent begins writing to an Indian company’s books it inherits that obligation on the first day.</p>' +
        '<p class="e1s-p">Reliability compounds, too. At 98% per-step accuracy a 20-step task succeeds about 67% of the time, and most production workflows run twenty to fifty steps.</p></div></div>' });
  }

  function homePath() {
    return band({ id: 'right-path', tone: 'surface', eyebrow: 'The Right Path',
      title: 'Ten checks, one order, every time.',
      lead: 'The same write type — an invoice for ACME Textiles — three ways. Every stage defaults to refuse: a missing gate result is a failure, never a pass. There is no warn, and no “succeeded with warnings”.',
      actions: btn('How each rung works', '#/product/how-it-works', 'secondary', 'arrow-right'),
      body: rpHtml() + '<p class="e1s-src">Sample tenant Kaveri Spinning Mills · declaration erp.ar v7 · policy v11 · proofs #4,098–#4,101. Latency budgets are modelled and published only when measured.</p>' });
  }

  function homePreview() {
    var body = '<div class="e1s-window" role="figure" aria-label="The elan1 console, sample data"><div class="e1s-window__bar">' + ic('work', 14) + '<b>Work</b><span>/ Approvals / Decide / OB-2026-0412</span><span class="e1s-sample">Sample data</span></div>' +
      '<div class="e1s-window__body">' + decideCard() + '<div class="e1s-stack">' + seal4101() +
      note('Approve writes approval #4,100, then the single writer commits #4,101. Reject needs a sentence, and nothing is written.', 'gate') + '</div></div></div>';
    return band({ id: 'preview', tone: 'sunken', eyebrow: 'The console',
      title: 'What the approver sees before anything is written.',
      lead: 'The proposal, the proposer in words, the whole diff, every declared gate and the policy version — then the record it leaves. Try it: approve, or reject with a sentence.',
      actions: btn('Tour the product', '#/product', 'secondary', 'arrow-right'),
      body: body + '<div class="e1s-grid e1s-grid--2" style="margin-top:16px">' + refusal4098() + '<div class="e1s-stack">' + c.chain([{ seq: 4101, digest: H.h4101, prev: H.h4100, writeType: 'erp.sales_invoice.submit', outcome: 'committed', at: '15:02 IST', actorKind: 'person', href: '#/assurance/proof/4101' }, { seq: 4100, digest: H.h4100, prev: H.h4099, writeType: 'approval', outcome: 'committed', at: '14:58 IST', actorKind: 'person', href: '#/assurance/proof/4100' }, { seq: 4099, digest: H.h4099, prev: H.h4098, writeType: 'erp.sales_invoice.submit', outcome: 'escalated', at: '11:02 IST', actorKind: 'agent', href: '#/assurance/proof/4099' }, { seq: 4098, digest: H.h4098, prev: H.h4097, writeType: 'erp.sales_invoice.submit', outcome: 'refused', at: '10:47 IST', actorKind: 'agent', href: '#/assurance/proof/4098' }], { standing: 'continuous', scope: '19 of 23 write types', count: 'seq 1–4,112', checkedAt: 'nightly 02:10 IST' }) + note('A refusal is a correct, free outcome, not an error: HTTP 200, a full record, and one next action. The code appears once, in small type, because support asks for it.') + '</div></div>' });
  }

  function homeDoors() {
    var doors = [
      ['work', 'Work', 'Approvals, the Decide screen, Not done, escalations, Reverse this and the stop switch.', '#/work/today'],
      ['records', 'Records', 'Connected systems, each record’s governed timeline, Declarations, write types and tenants.', '#/records/systems'],
      ['agents', 'Agents', 'The agent registry, autonomy A0–A5, graduation, keys and channels — people separately from software.', '#/agents/registry'],
      ['assurance', 'Assurance', 'Proof and chain standing, coverage, refusals, the meter and what you can truthfully claim.', '#/assurance']
    ];
    return band({ id: 'doors', tone: 'paper', eyebrow: 'The Four Doors',
      title: 'Four doors. No fifth, and no settings tab.',
      lead: 'Every console built on elan1 renders the same grammar from its Declaration: Work · Records · Agents · Assurance. The doors are never renamed — in any pack, or under any partner’s brand.',
      body: '<div class="e1s-grid e1s-grid--4">' + doors.map(function (d) {
        var q = (E1.nav[d[0]] && E1.nav[d[0]].question) || '';
        return card({ href: d[3], cls: 'e1s-door', extra: '', bodyHtml: true, body:
          '<span class="e1s-door__ic">' + ic(d[0], 20) + '</span><h3 class="e1s-h3">' + esc(d[1]) + '</h3><p class="e1s-door__q">' + esc(q) + '?</p><p class="e1s-card__d">' + esc(d[2]) + '</p>', foot: 'Open ' + d[1] });
      }).join('') + '</div>' });
  }

  function levelCard(L, o) {
    o = o || {};
    var l = D.levels[L];
    return '<article class="e1s-card e1s-lvl' + (L === 'L1' ? ' e1s-card--accent' : '') + '">' +
      '<div class="e1s-card__top">' + c.level(L) + status(l.status) + '</div>' +
      '<p class="e1s-lvl__claim">“' + esc(l.claim) + '”</p>' +
      '<p class="e1s-card__d"><b style="color:var(--text-primary)">' + esc(l.buyer) + '</b> asks: ' + esc(l.q) + '</p>' +
      list(o.full ? l.has : l.has.slice(0, 4), { tight: true }) +
      '<div class="e1s-lvl__gate">' + ic('gate', 16) + '<span><b>Gate ' + esc(l.gate) + '.</b> ' + esc(l.gateText) + '</span></div>' +
      '<p class="e1s-lvl__price">From ' + inr(l.price) + ' a year ' + prov('MODELLED') + '</p></article>';
  }

  function homeLevels() {
    return band({ id: 'levels', tone: 'surface', eyebrow: 'Assurance levels',
      title: 'Three levels of a claim. Gates, not dates.',
      lead: 'A level is a property of the proof and the claim, never of the policy — the same declaration carries across all three. Each level arrives when an observable gate passes, not on a calendar.',
      actions: btn('What you can claim at each level', '#/assurance-levels', 'secondary', 'arrow-right'),
      body: '<div class="e1s-grid e1s-grid--3">' + levelCard('L1') + levelCard('L2') + levelCard('L3') + '</div>' });
  }

  function homePacks() {
    return band({ id: 'packs', tone: 'paper', eyebrow: 'Packs',
      title: 'A regime is a pack. A country is a set of packs.',
      lead: 'A pack is configuration, not code: one declaration, one verifier profile and one export mapping, aimed at one buyer with one auditor under one dated obligation. Every candidate passes five gates or it is refused by name.',
      actions: btn('All packs and the refusals', '#/packs', 'secondary', 'arrow-right'),
      body: '<div class="e1s-grid e1s-grid--3">' + ['ledger1', 'invoice1', 'collect1'].map(function (id) {
        var p = D.packs[id];
        return card({ href: '#/packs/' + id, k: p.id, badge: status(p.statusKind, p.statusKind === 'sketch' ? 'Spec sketch' : 'Specification'), title: p.order, body: p.obligation, foot: 'Read the pack' });
      }).join('') + '</div>' });
  }

  function homePricing() {
    var p = D.price;
    var rows = [['L1 Guarded', p.L1], ['L2 Attested', p.L2], ['L3 Proven', p.L3]].map(function (r) {
      return '<tr><th scope="row">' + esc(r[0]) + '</th><td class="is-right e1-mono">' + inr(r[1].floor) + '</td><td class="is-right e1-mono">' + num(r[1].incl) + '</td><td class="is-right e1-mono">₹' + r[1].rate.toFixed(2) + '</td></tr>';
    }).join('');
    return band({ id: 'pricing', tone: 'sunken', eyebrow: 'Pricing',
      title: 'We bill for one thing: the governed action. Refusals are free.',
      lead: 'One write that was permitted, executed, recorded and billed — one row in the chain, one meter event, one invoice line, one thing an auditor can open. No per-seat price and no outcome price, at any level.',
      body: '<div class="e1s-split e1s-split--wide"><div class="e1s-stack">' +
        '<div class="e1-table-wrap"><table class="e1-table"><caption class="e1-sr">Modelled list prices per tenant per year</caption><thead><tr><th scope="col">Level</th><th scope="col" class="is-right">Floor a year</th><th scope="col" class="is-right">Included actions</th><th scope="col" class="is-right">Beyond, per action</th></tr></thead><tbody>' + rows + '</tbody></table></div>' +
        note('<b>Modelled list prices, subject to change before general availability.</b> There is no published price list yet. The verifier is free, to anyone, for ever. A refusal is ₹0 — the database enforces it.', 'rupee') +
        '<div class="e1-row" style="gap:10px;flex-wrap:wrap">' + btn('See pricing', '#/pricing', 'primary', 'arrow-right') + btn('Estimate your year', '#/pricing/calculator', 'secondary', 'sliders') + '</div></div>' +
        '<div>' + invoiceSnippet() + '<p class="e1s-src">The invoice is the demo: the refusal count sits on the same table as the billed lines.</p></div></div>' });
  }

  function homeHonest() {
    var caps = [
      ['KernelPort v1 — six calls', 'Frozen interface', 'spec'], ['The Right Path kernel (L1)', 'Nine rungs, single writer, hash-chained proof', 'building'],
      ['The console — Four Doors', 'You are looking at the prototype', 'building'], ['Seal v6 — signing (L2)', 'Sixteen fields, frozen; no signature yet', 'spec'],
      ['Offline verifier', 'Free, as source, at L2', 'spec'], ['ledger1 — first India pack', 'MCA audit trail', 'spec'],
      ['Action Receipt standard', 'Draft; not open until someone else implements it', 'spec'], ['Certifications', 'We hold none of any kind', 'notbuilt']
    ];
    return band({ id: 'where', tone: 'ink', eyebrow: 'Where we are, today',
      title: 'Designed is not shipped.',
      lead: 'Eleven people, no external customer, no signed order, no invoice, no certification held and no evidence bundle yet verified by anyone outside the company. Zero governed actions committed and zero refused. We would rather you read that here than find it later.',
      actions: '<a class="e1s-btn e1s-btn--line" href="#/roadmap">Roadmap and gates ' + ic('arrow-right', 16) + '</a>',
      body: '<div class="e1s-stats">' + stat('11', 'people, working between Coimbatore and Chennai.') + stat('0', 'external customers. rung1’s internal use is not counted as traction.') + stat('₹0', 'revenue. Cost per governed action is modelled, not measured.') + stat('0', 'governed actions committed. Refusal rate: not yet observable.') + '</div>' +
        '<div class="e1s-caps" style="margin-top:40px">' + caps.map(function (x) { return '<div class="e1s-cap"><span>' + esc(x[0]) + '<small>' + esc(x[1]) + '</small></span>' + status(x[2], x[2] === 'notbuilt' ? 'None held' : null) + '</div>'; }).join('') + '</div>' +
        '<p class="e1s-src">Status vocabulary: specification · building · generally available · not built. Nothing on this site reads “coming soon”. Figures as at 22 September 2026.</p>' });
  }

  function homeAudience() {
    var a = [
      ['Operators', 'Can I let this run without it doing something I cannot undo?', '#/product', 'work'],
      ['Auditors and CA firms', 'Can I check a client’s evidence without buying anything from the client’s vendor?', '#/auditors', 'stamp'],
      ['Regulators', 'Can I reconstruct what an agent did and why?', '#/regulators', 'scale'],
      ['Insurers', 'Is there trace-level evidence, a working stop and scoped authority?', '#/insurers', 'assurance'],
      ['Partners', 'May I introduce, implement or verify without overclaiming?', '#/partners', 'users'],
      ['Developers', 'Can I integrate once against a frozen contract?', '#/developers', 'code']
    ];
    return band({ id: 'who', tone: 'paper', eyebrow: 'Who it is for',
      title: 'Answerable to the person who asks.',
      body: '<div class="e1s-grid e1s-grid--3">' + a.map(function (x) { return card({ href: x[2], icon: x[3], title: x[0], body: x[1], foot: 'Read on' }); }).join('') + '</div>' });
  }

  function closingCta() {
    return '<section class="e1s-band e1s-band--ink" aria-labelledby="e1s-cta-h">' + wrap('<div class="e1s-split" style="align-items:end"><div><p class="e1s-eyebrow">Next step</p><h2 class="e1s-h2" id="e1s-cta-h">Start with one process. Add the next when it holds.</h2>' +
      '<p class="e1s-lead">A working session is 90 minutes with your finance lead and, ideally, your auditor. We will ask for your auditor’s name — a pilot needs one. Already have a tenant? <a href="#/auth/sign-in">Sign in</a>.</p></div>' +
      '<div class="e1s-hero__cta" style="justify-content:flex-end"><a class="e1s-btn e1s-btn--paper" href="#/demo">Book a working session ' + ic('arrow-right', 16) + '</a><a class="e1s-btn e1s-btn--line" href="#/verify">Verify a record</a><a class="e1s-btn e1s-btn--line" href="#/developers">Developers</a></div></div>') + '</section>';
  }

  E1.route('/', {
    title: 'elan1 — the governed write path', layout: 'public', keywords: 'home website positioning',
    render: function () {
      return homeHero() + homeProblem() + homePath() + homePreview() + homeDoors() + homeLevels() + homePacks() + homePricing() + homeHonest() + homeAudience() + closingCta();
    },
    mount: function () { if (RP.keep) { RP.keep = false; rpPaint(); } else rpPlay(true); }
  });

  /* ------------------------------------------------------------------------
     PRODUCT  #/product
     ------------------------------------------------------------------------ */
  function diagram() {
    return '<div class="e1s-dia" role="img" aria-label="An agent sends a write intent to KernelPort. The kernel runs ten checks, asks a named person where required, and the single writer commits to the system of record. Every outcome is recorded and metered.">' +
      '<div class="e1s-dia__col"><div class="e1s-zone e1s-z-consumer"><p class="e1s-zone__l">Consumer</p><p class="e1s-zone__t">Your agent, app or MCP client</p><p class="e1s-zone__d">rung1, a third-party agent, an ISV. It may produce a write intent.</p></div>' +
      '<div class="e1s-zone e1s-z-people"><p class="e1s-zone__l">People</p><p class="e1s-zone__t">A named approver</p><p class="e1s-zone__d">Resolver sets hold people only. An agent may never approve.</p></div></div>' +
      '<div class="e1s-dia__arrow">' + ic('arrow-right', 20) + '</div>' +
      '<div class="e1s-dia__col"><div class="e1s-zone e1s-z-kernel" style="flex:1"><p class="e1s-zone__l">Kernel · KernelPort v1</p><p class="e1s-zone__t">define · assert · seal · verify · scope · refuse</p><p class="e1s-zone__d">One write function. No fast path, no batch variant, no admin mode, no decision cache.</p>' +
        '<div class="e1s-dia__rungs">' + D.rungs.map(function (r) { return '<span>' + esc(r[0]) + ' ' + esc(r[1]) + '</span>'; }).join('') + '</div></div>' +
        '<div class="e1s-zone e1s-z-refusal"><p class="e1s-zone__l">Refusal</p><p class="e1s-zone__t">Not done — recorded, typed, ₹0</p><p class="e1s-zone__d">43 codes in a closed register. Platform failures say “we failed”.</p></div></div>' +
      '<div class="e1s-dia__arrow">' + ic('arrow-right', 20) + '</div>' +
      '<div class="e1s-dia__col"><div class="e1s-zone e1s-z-external"><p class="e1s-zone__l">System of record</p><p class="e1s-zone__t">ERPNext today</p><p class="e1s-zone__d">Written by a single writer holding a single-use credential that lives ten minutes. We link out; we never copy your records.</p></div>' +
      '<div class="e1s-zone e1s-z-runtime"><p class="e1s-zone__l">Proof and meter</p><p class="e1s-zone__t">Hash-chained record · one meter event</p><p class="e1s-zone__d">The invoice line and the evidence record are the same object.</p></div></div></div>';
  }

  E1.route('/product', {
    title: 'Product — the control plane', layout: 'public', keywords: 'kernel kernelport six calls modes enforced advisory',
    render: function () {
      var refuses = [
        'An ERP, a CRM, or a UI shell for somebody else’s product — or a second write path.',
        'A fast path, a batch variant, an admin mode or a decision cache. A cached allow is an allow at an unknown rule version.',
        'A seventeenth proof field, at any level, ever.',
        'A trust anchor, a shared ledger, a consortium chain or any network elan1 operates.',
        'A cross-tenant benchmark. Not opt-in, not anonymised. Not built.',
        'A model in the decision or graduation path. A model may rank, summarise or explain — for a human reader.',
        'Per-seat or outcome pricing, or a price on the verifier.',
        'A blockchain. The property wanted is a timestamp from a party with no interest in the matter.',
        'Our own identity product. We consume identity and differentiate on enforcement, approval and evidence.',
        'Any route to raise autonomy other than the graduation write — no support action, admin toggle, contract clause or pricing tier.'
      ];
      return hero({ eyebrow: 'Product', title: 'One kernel, six calls, ten checks, three levels.',
          lead: 'elan1 is the governed write path underneath your agents. It decides whether a write is permitted, puts a named person in front of the ones that need one, executes it through a single writer, and records every outcome — the refusals included.',
          actions: btn('How it works', '#/product/how-it-works', 'primary', 'arrow-right') + btn('Watch a write climb', '#/product/right-path', 'secondary') + btn('Book a working session', '#/demo', 'ghost'),
          toc: [{ id: 'p-l1', label: 'The L1 sentence' }, { id: 'p-shape', label: 'The shape' }, { id: 'p-calls', label: 'Six calls' }, { id: 'p-modes', label: 'Two modes' }, { id: 'p-console', label: 'The console' }, { id: 'p-refuse', label: 'What we refuse to build' }] }) +
        band({ id: 'p-l1', tone: 'paper', eyebrow: 'Frozen at L1', title: 'The one sentence we will not go beyond.', body: '<div class="e1s-split e1s-split--wide"><div>' + quote(D.l1Sentence, 'The L1 claim, frozen verbatim. It appears on the Assurance door and on every L1 export.', true) + '</div><div class="e1s-stack">' +
          card({ icon: 'chain', title: 'Tamper-evident, not stronger', body: 'An alteration to the chain is detectable. We do not use stronger words until a stranger can check the record without us — that is Assurance Level 2.' }) +
          card({ icon: 'lock', title: 'At L1, verify requires us', body: 'We state that limitation in those words, on the screen, before anyone relies on it.' }) + '</div></div>' }) +
        band({ id: 'p-shape', tone: 'surface', eyebrow: 'The shape', title: 'Between the agent and the system of record.', lead: 'Everything that wants to change a system of record passes one seam. There is no second write path, including for demonstrations.', body: diagram() + '<p class="e1s-src">Diagram colours mark zones, not status.</p>' }) +
        band({ id: 'p-calls', tone: 'paper', eyebrow: 'KernelPort v1', title: 'Six calls, and nothing else.', lead: 'Identical for every consumer, in every product, at every assurance level. The call shape does not change between levels; the contents do.',
          actions: btn('Read the KernelPort reference', '#/developers/kernelport', 'secondary', 'arrow-right'),
          body: c.table({ caption: 'KernelPort calls', columns: [{ key: 0, label: 'Call', mono: true, width: '120px', render: function (r) { return '<span class="e1s-mono" style="font-weight:600">' + esc(r[0]) + '</span>'; } }, { key: 1, label: 'What it does' }, { key: 2, label: 'Who may call it', width: '200px' }], rows: D.calls, rowHref: function (r) { return '#/developers/kernelport/' + r[0]; } }) }) +
        band({ id: 'p-modes', tone: 'sunken', eyebrow: 'Two modes, two claims', title: 'We say which one you are in, in writing.',
          lead: 'The mode is set per write type, rendered on the Assurance door, printed in every export and sealed into every later record. It can never be set in a tool call.',
          body: '<div class="e1s-grid e1s-grid--2">' +
            card({ k: 'ENFORCED', title: 'The kernel holds the credential', bodyHtml: true, body: '<p class="e1s-card__d">Or the target system accepts only kernel-issued tokens.</p>' + quote('This write could not have occurred without passing the gates.', 'The permitted claim', true) + list(['Today: rung1 in hosted mode, and nothing else.', 'SDK in-process integrations.'], { tight: true }) }) +
            card({ k: 'ATTESTED ADVISORY', title: 'The caller holds the credential', bodyHtml: true, body: '<p class="e1s-card__d">Every attempt is evaluated and recorded — but nothing physically stops a caller that ignores a refusal.</p>' + quote('Every attempt is evaluated and recorded, including the ones we refused.', 'The permitted claim', true) + list(['MCP and HTTP integrations.', 'A caller that proceeds after a refusal produces an unmatched write, caught by reconciliation afterwards.'], { tight: true }) }) + '</div>' +
            '<div style="margin-top:16px">' + c.callout({ kind: 'rule', title: 'Promotion to Enforced is reviewed per write type, never per tenant', body: '<p>It needs at least 30 days of advisory traffic, a bypass proof, no long-lived credential anywhere, and a rollback drill.</p>' }) + '</div>' }) +
        band({ id: 'p-console', tone: 'paper', eyebrow: 'The console', title: 'Rendered from the Declaration, not drawn by hand.',
          lead: 'Work · Records · Agents · Assurance. Channels adapt the same decision to web, mobile, WhatsApp, voice, API and MCP — a channel adapts; it never decides.',
          body: '<div class="e1s-window"><div class="e1s-window__bar">' + ic('records', 14) + '<b>Records</b><span>/ ACME Textiles / SINV-2026-01187</span><span class="e1s-sample">Sample data</span></div><div class="e1s-window__body">' +
            c.card({ title: 'Governed timeline · SINV-2026-01187', body: c.timeline([
              { time: '24 Sep 2026, 15:02 IST', title: 'Committed · invoice submitted · #4,101', state: 'good', actor: { name: 'Venkat Raman', kind: 'person', role: 'Approver' }, href: '#/assurance/proof/4101' },
              { time: '24 Sep 2026, 14:58 IST', title: 'Approved · #4,100', state: 'info', actor: { name: 'Venkat Raman', kind: 'person' } },
              { time: '24 Sep 2026, 11:02 IST', title: 'Waiting on a person · OB-2026-0412 · #4,099', state: 'warning', actor: { name: 'ar-agent', kind: 'agent', role: 'A2 Propose' }, href: '#/work/decide/OB-2026-0412' },
              { time: '24 Sep 2026, 10:47 IST', title: 'Not done — credit limit · #4,098', body: 'An earlier ₹4,20,000 draft for ACME Textiles, refused at G9 precondition.', state: 'neutral', actor: { name: 'ar-agent', kind: 'agent', role: 'A3 Act reversible' }, href: '#/assurance/proof/4098' }]) }) +
            '<div class="e1s-stack">' + c.chain([{ seq: 4101, digest: H.h4101, prev: H.h4100, writeType: 'erp.sales_invoice.submit', outcome: 'committed', at: '15:02 IST', actorKind: 'person', href: '#/assurance/proof/4101' }, { seq: 4100, digest: H.h4100, prev: H.h4099, writeType: 'approval', outcome: 'committed', at: '14:58 IST', actorKind: 'person', href: '#/assurance/proof/4100' }, { seq: 4099, digest: H.h4099, prev: H.h4098, writeType: 'erp.sales_invoice.submit', outcome: 'escalated', at: '11:02 IST', actorKind: 'agent', href: '#/assurance/proof/4099' }], { standing: 'continuous', scope: '19 of 23 write types', count: 'seq 1–4,112', checkedAt: 'nightly 02:10 IST' }) +
            note('Records never copies your invoices or ledgers. It pins a few fields, shows the governed timeline — refusals and escalations included — and links out: “Open in ERPNext”.') + '</div></div></div>' +
            '<div class="e1s-grid e1s-grid--4" style="margin-top:24px">' + [['work', 'Work', '#/work/today'], ['records', 'Records', '#/records/systems'], ['agents', 'Agents', '#/agents/registry'], ['assurance', 'Assurance', '#/assurance']].map(function (d) { return card({ href: d[2], icon: d[0], title: d[1], body: (E1.nav[d[0]].question || '') + '?', foot: 'Open' }); }).join('') + '</div>' }) +
        band({ id: 'p-refuse', tone: 'surface', eyebrow: 'The written boundary', title: 'What elan1 refuses to build.', lead: 'A boundary written down is one a salesperson cannot move. These are closed decisions, not a roadmap.',
          body: '<div class="e1s-grid e1s-grid--2">' + refuses.map(function (t, i) { return '<div class="e1s-cap" style="grid-template-columns:40px minmax(0,1fr);align-items:start"><span class="e1s-card__k">' + (i < 9 ? '0' : '') + (i + 1) + '</span><span>' + esc(t) + '</span></div>'; }).join('') + '</div>' }) +
        closingCta();
    }
  });

  /* ------------------------------------------------------------------------
     HOW IT WORKS  #/product/how-it-works
     ------------------------------------------------------------------------ */
  E1.route('/product/how-it-works', {
    title: 'How it works — the ten checks', layout: 'public', keywords: 'rungs gates autonomy refusals http',
    render: function () {
      var rungCards = D.rungs.map(function (r) {
        return '<article class="e1s-card' + (r[5] ? ' e1s-card--accent' : '') + '"><div class="e1s-card__top"><span class="e1s-card__k">Rung ' + esc(r[0]) + '</span><span class="e1s-tag">p50 ' + esc(r[4]) + ' · ' + 'modelled</span></div>' +
          '<h3 class="e1s-h3 e1s-mono" style="font-family:var(--font-mono);font-size:16px">' + esc(r[1]) + '</h3><p class="e1s-card__d">' + esc(r[2]) + '</p>' +
          '<p class="e1s-card__d" style="margin-top:auto;padding-top:10px;border-top:1px solid var(--border-subtle);font-size:12px"><b style="color:var(--text-primary)">Written to the record:</b> ' + esc(r[3]) + '</p></article>';
      }).join('');
      var tax = [['Refusal', '200', 'Yes', 'Zero', 'Never'], ['Escalation', '200', 'Yes', 'Zero', 'Never — wait for the outcome'], ['Rejection (malformed)', '4xx', 'No', 'No', 'Only after fixing'], ['Throttle', '429', 'No', 'No', 'Yes, with backoff'], ['Platform failure', '5xx or PLATFORM.*', 'Refusal only', 'No', 'Same idempotency key'], ['Tenant stopped', '200', 'No', 'No', 'No']];
      return hero({ eyebrow: 'How it works', title: 'Every governed write climbs the same ten checks in the same order.',
          lead: 'Each check has one job and leaves a row behind. Eight of the ten make no model call; the one that may — evaluate() — returns a versioned rule decision, never a score.',
          actions: btn('Watch three writes climb', '#/product/right-path', 'primary', 'arrow-right') + btn('Refusal register', '#/developers/refusals', 'secondary'),
          toc: [{ id: 'h-rungs', label: 'The rungs' }, { id: 'h-gates', label: 'Nine gates' }, { id: 'h-auto', label: 'Autonomy A0–A5' }, { id: 'h-out', label: 'Outcomes' }, { id: 'h-http', label: 'HTTP and retries' }] }) +
        band({ id: 'h-rungs', tone: 'paper', eyebrow: 'The Right Path', title: 'Ten checks, each with one job.', lead: 'The screen says “nine rungs”; the kernel counts ten checks because the stop set, 0b, runs first. Rungs 7–9 are the single writer, the proof and the meter.',
          body: '<div class="e1s-grid e1s-grid--4" style="grid-template-columns:repeat(auto-fill,minmax(250px,1fr))">' + rungCards + '</div>' +
            '<p class="e1s-src">Latency budgets are modelled — kernel about 64 ms p50, end to end ≤ 2 s p95 — and are published as measurements only once measured.</p>' }) +
        band({ id: 'h-gates', tone: 'surface', eyebrow: 'Rung 3', title: 'Nine gates. Six are never skippable.', lead: 'Gates are pure functions of context, declaration version, record state and an explicit as-of time — no gate reads a clock. The first failure sets the refusal code; the rest still run and record, so an operator sees every problem at once.',
          body: c.table({ caption: 'Pre-gates G1–G9', columns: [{ key: 0, label: 'Gate', mono: true, width: '70px' }, { key: 1, label: 'Name', width: '150px', render: function (r) { return '<b>' + esc(r[1]) + '</b>'; } }, { key: 3, label: 'Asserts' }, { key: 2, label: 'Can be declared off', width: '180px', render: function (r) { return r[2] === 'Never' ? c.badge('neutral', 'Never', { subtle: true, icon: 'lock' }) : '<span class="e1-caption">' + esc(r[2]) + '</span>'; } }, { key: 4, label: 'Refusal code', mono: true, render: function (r) { return '<a href="#/developers/refusals/' + esc(r[4]) + '" class="e1-mono" style="font-size:12px">' + esc(r[4]) + '</a>'; } }], rows: D.gates }) +
            '<p class="e1s-src">Display order is the declared order, which is semantic. For erp.sales_invoice.submit: consent, residency, retention, counterparty, precondition, dual control, budget.</p>' }) +
        band({ id: 'h-auto', tone: 'paper', eyebrow: 'Rung 6', title: 'Autonomy is a property of the actor, and there is no A6.', lead: 'A missing grant resolves to A0 — not to a tenant default, not by inheritance. There is no API that sets a level; raising one is itself a governed write with two people.',
          body: '<div class="e1s-grid e1s-grid--3">' + D.autonomy.map(function (a) { return '<article class="e1s-card">' + c.autonomy(a[0]) + '<p class="e1s-card__d">' + esc(a[2]) + '</p></article>'; }).join('') + '</div>' +
            '<div class="e1s-grid e1s-grid--2" style="margin-top:16px">' + c.callout({ kind: 'rule', title: 'No reversal plan, no A3 or above', body: '<p>An irreversible write type can never be auto-approved, and an agent may never approve.</p>' }) + c.callout({ kind: 'info', title: 'Delegation does not confer autonomy', body: '<p>Acting on behalf of a person makes someone accountable. It does not make the agent more trusted.</p>' }) + '</div>' }) +
        band({ id: 'h-out', tone: 'sunken', eyebrow: 'Outcomes', title: 'Three outcomes, not four.', lead: 'Committed, Not done, or Waiting on a person. There is no warn. Platform failure is ours, and says so.',
          body: '<div class="e1s-grid e1s-grid--4">' +
            card({ bodyHtml: true, body: c.outcome('committed') + '<p class="e1s-card__d">Every rung passed. One record written, one meter event, one invoice line.</p>' }) +
            card({ bodyHtml: true, body: c.outcome('refused') + '<p class="e1s-card__d">“Not done — {plain reason}”, the numbers, one next action. HTTP 200, a full record, ₹0.</p>' }) +
            card({ bodyHtml: true, body: c.outcome('escalated') + '<p class="e1s-card__d">The honest version of warn: a person decides, and nothing is written until they do.</p>' }) +
            card({ bodyHtml: true, body: c.outcome('platform') + '<p class="e1s-card__d">“This is our failure, not a rule. Nothing was changed, you have not been billed, and we have been paged.”</p>' }) + '</div>' }) +
        band({ id: 'h-http', tone: 'paper', eyebrow: 'For integrators', title: 'A refusal is not an error, so it is not a 4xx.', lead: 'Clients retry 4xx, and a retried refusal is an attempt to get a different answer. Never retry a refusal.',
          body: c.table({ caption: 'Error taxonomy', columns: [{ key: 0, label: 'Kind', render: function (r) { return '<b>' + esc(r[0]) + '</b>'; } }, { key: 1, label: 'HTTP', mono: true }, { key: 2, label: 'Proof record' }, { key: 3, label: 'Meter' }, { key: 4, label: 'Retry' }], rows: tax }) +
            '<div class="e1-row" style="margin-top:20px;gap:10px;flex-wrap:wrap">' + btn('Quickstart', '#/developers/quickstart', 'primary', 'arrow-right') + btn('Get a sandbox key', '#/developers/sandbox-key', 'secondary') + '</div>' }) +
        closingCta();
    }
  });

  /* ------------------------------------------------------------------------
     RIGHT PATH  #/product/right-path  (?step=4097…4101 — tabs as links)
     ------------------------------------------------------------------------ */
  var WALK = [
    { seq: 4097, tab: '#4,097 Committed', title: 'Rekha records a payment', outcome: 'committed', at: 9,
      story: 'Rekha Subramanian holds A4 Act bounded on erp.payment_entry.submit, declared in erp.ar v7 with a blast radius of one counterparty. The gates pass — consent, residency Mumbai, retention, counterparty, precondition — and policy v11 allows.',
      screen: 'Her screen reads “Payment recorded · proof #4,097” with a “Reverse this” control valid for 30 days.' },
    { seq: 4098, tab: '#4,098 Not done', title: 'ar-agent proposes an invoice above the credit limit', outcome: 'refused', at: 3,
      story: 'ar-agent, at A3, proposes an ACME Textiles invoice of ₹4,20,000 against a ₹3,00,000 credit limit. Gate G9 precondition fails. The remaining gates still run and record.',
      screen: '“Not done — credit limit”, the two numbers, and two next actions: request a limit change (itself a governed write) or reduce the invoice. HTTP 200, and ₹0.' },
    { seq: 4099, tab: '#4,099 Waiting', title: 'A smaller invoice escalates to a person', outcome: 'escalated', at: 6,
      story: 'A ₹2,40,000 invoice from ar-agent at A2 Propose passes every gate and policy v11 allows — but A2 means a person approves before the write. The ladder stops at rung 6.',
      screen: 'Obligation OB-2026-0412 goes to the ar-approvers resolver set, with a four-hour expiry.' },
    { seq: 4100, tab: '#4,100 Approval', title: 'Venkat Raman approves — and that is a write too', outcome: 'committed', at: 9,
      story: 'An approval is a governed write, not a flag. It records the approver, a digest of the payload they were shown, and the time.',
      screen: 'Venkat saw the diff, all seven declared gates and the policy version before he pressed Approve.' },
    { seq: 4101, tab: '#4,101 Committed', title: 'The single writer commits the invoice', outcome: 'committed', at: 9,
      story: 'The kernel snapshots, applies in the shadow sandbox, re-runs the gates, and writes identical bytes to ERPNext with a single-use credential that lives ten minutes. It re-runs the gates on live.',
      screen: 'Proof #4,101, chained to #4,100. One governed action, metered per counterparty.' }
  ];
  E1.route('/product/right-path', {
    title: 'The Right Path — a worked example', layout: 'public', keywords: 'walkthrough rekha 4097 4101 example',
    render: function (p, q) {
      var cur = WALK.filter(function (w) { return String(w.seq) === String(q.step); })[0] || WALK[0];
      var idx = WALK.indexOf(cur);
      var tabs = c.tabs(WALK.map(function (w) { return { id: String(w.seq), label: w.tab, href: '#/product/right-path?step=' + w.seq }; }), String(cur.seq), { label: 'Proof sequence' });
      var spec = cur.seq === 4098 ? refusal4098()
        : cur.seq === 4099 ? decideCard({ compact: true, noActions: true })
        : cur.seq === 4101 ? seal4101()
        : cur.seq === 4100 ? c.seal({ level: 'L1', seq: 4100, writeType: 'approval · OB-2026-0412', outcome: 'committed', actor: { name: 'Venkat Raman', kind: 'person' }, at: '24 Sep 2026, 14:58 IST', digest: H.h4100, prev: H.h4099, declaration: 'erp.ar v7', policy: 'policy v11' })
        : c.seal({ level: 'L1', seq: 4097, writeType: 'erp.payment_entry.submit', outcome: 'committed', blast: 2, reversible: '30 days', amount: 118000, actor: { name: 'Rekha Subramanian', kind: 'person' }, at: '24 Sep 2026, 10:12 IST', digest: H.h4097, prev: '0c1f44e2b8a9d3f0776e15ac2b9d4e81f03a6c5d2e7b8f9a0c1d2e3f4a5b6c7d', declaration: 'erp.ar v7', policy: 'policy v11' });
      var nav = '<div class="e1-row e1-row--between" style="margin-top:24px;flex-wrap:wrap;gap:8px">' +
        (idx > 0 ? c.button('Previous: ' + WALK[idx - 1].tab, { href: '#/product/right-path?step=' + WALK[idx - 1].seq, icon: 'arrow-left', kind: 'ghost' }) : '<span></span>') +
        (idx < WALK.length - 1 ? c.button('Next: ' + WALK[idx + 1].tab, { href: '#/product/right-path?step=' + WALK[idx + 1].seq, iconRight: 'arrow-right', kind: 'primary' }) : c.button('How each rung works', { href: '#/product/how-it-works', iconRight: 'arrow-right', kind: 'primary' })) + '</div>';
      return hero({ eyebrow: 'The Right Path', title: 'Five proof records, one morning at Kaveri Spinning Mills.',
          lead: 'A worked example from the sample tenant: a payment, a refusal, an escalation, an approval and a commit — seq #4,097 to #4,101 on the same chain. Use the tabs, or the arrow buttons.',
          meta: '<span class="e1s-tag">erp.ar v7</span><span class="e1s-tag">policy v11</span><span class="e1s-tag">ACME Textiles · credit limit ₹3,00,000</span>' + prov('MODELLED') + '<span>Sample data</span>' }) +
        band({ tone: 'paper', tight: true, body: tabs +
          '<div class="e1s-split e1s-split--wide" style="margin-top:28px"><div class="e1s-stack"><p class="e1s-eyebrow" style="margin:0">Proof #' + num(cur.seq) + '</p><h2 class="e1s-h2">' + esc(cur.title) + '</h2>' +
          '<p class="e1s-lead" style="margin-top:0">' + esc(cur.story) + '</p>' + note('<b>On screen:</b> ' + esc(cur.screen), 'eye') +
          c.rungs({ outcome: cur.outcome, at: cur.at, notes: cur.seq === 4098 ? { 3: 'G9 precondition failed' } : cur.seq === 4099 ? { 6: 'A2 needs a person' } : {} }) + '</div>' +
          '<div>' + spec + '</div></div>' + nav }) +
        band({ tone: 'sunken', eyebrow: 'The chain', title: 'All five, in order, refusals included.', lead: 'A timeline of successes only is a timeline that lies by omission.',
          body: c.chain([
            { seq: 4101, digest: H.h4101, prev: H.h4100, writeType: 'erp.sales_invoice.submit', outcome: 'committed', at: '15:02 IST', actorKind: 'person', href: '#/assurance/proof/4101' },
            { seq: 4100, digest: H.h4100, prev: H.h4099, writeType: 'approval', outcome: 'committed', at: '14:58 IST', actorKind: 'person', href: '#/assurance/proof/4100' },
            { seq: 4099, digest: H.h4099, prev: H.h4098, writeType: 'erp.sales_invoice.submit', outcome: 'escalated', at: '11:02 IST', actorKind: 'agent', href: '#/assurance/proof/4099' },
            { seq: 4098, digest: H.h4098, prev: H.h4097, writeType: 'erp.sales_invoice.submit', outcome: 'refused', at: '10:47 IST', actorKind: 'agent', href: '#/assurance/proof/4098' },
            { seq: 4097, digest: H.h4097, prev: '0c1f44e2b8a9d3f0776e15ac2b9d4e81f03a6c5d2e7b8f9a0c1d2e3f4a5b6c7d', writeType: 'erp.payment_entry.submit', outcome: 'committed', at: '10:12 IST', actorKind: 'person', href: '#/assurance/proof/4097' }
          ], { standing: 'continuous', scope: '19 of 23 write types', count: 'seq 1–4,112', checkedAt: 'nightly 02:10 IST' }) }) +
        closingCta();
    }
  });

  /* ------------------------------------------------------------------------
     DECLARATION  #/product/declaration
     ------------------------------------------------------------------------ */
  E1.route('/product/declaration', {
    title: 'The Declaration — policy as data', layout: 'public', keywords: 'ontology seven blocks dispositions',
    render: function () {
      var sample = '{\n  "identity": { "slug": "erp_ar", "owner_role": "accounts_head", "residency_domain": "in", "system_of_record": "erpnext" },\n  "write_types": [{\n    "name": "erp.sales_invoice.submit",\n    "label": "Submit invoice",\n    "blast_radius": "one_counterparty",\n    "dual_control": { "above_inr": 200000 },\n    "gates": ["consent", "residency", "retention", "counterparty", "precondition", "dual_control", "budget"],\n    "reversal_plan": { "method": "target_native_undo", "window_hours": 24, "after_window": "compensating_instrument" }\n  }],\n  "permissions": { "grants": [\n    { "actor_kind": "agent", "role": "ar-agent", "write_type": "erp.sales_invoice.submit", "min_autonomy": "A2", "may_approve": false },\n    { "actor_kind": "human", "role": "ar-approvers", "write_type": "erp.sales_invoice.submit", "may_approve": true }\n  ]},\n  "channels": [{ "name": "web", "kind": "web", "may_approve": true, "mode": "enforced" },\n               { "name": "whatsapp", "kind": "messaging", "may_approve": false, "mode": "enforced" }]\n}';
      var sem = [['L0-S01', 'Every write type in permissions exists.'], ['L0-S03', 'Exactly one of reversal_plan or irreversible: true.'], ['L0-S04', 'Irreversible forces a blast radius of at least one counterparty.'], ['L0-S05', 'Tenant or cross_boundary forces dual control.'], ['L0-S06', 'cross_boundary forces a non-empty proof binding.'], ['L0-S09', 'policy_exempt needs an ADR and is never valid on an irreversible write type.'], ['L0-S11', 'may_approve is false for agents.']];
      return hero({ eyebrow: 'The Declaration', title: 'Policy as data, in seven blocks.',
          lead: 'The Declaration is the elan1 Ontology: one machine-readable object that says what a module is and what it may do. It is attested by transactions that cleared, not extracted from documents.',
          actions: btn('Declarations in the console', '#/records/declarations/erp.ar', 'primary', 'arrow-right') + btn('Schema reference', '#/developers/declarations', 'secondary'),
          toc: [{ id: 'd-read', label: 'Read aloud' }, { id: 'd-disp', label: 'Three dispositions' }, { id: 'd-chain', label: 'Clause to proof field' }, { id: 'd-rules', label: 'Rules and lifecycle' }, { id: 'd-map', label: 'Compared with Palantir' }] }) +
        band({ id: 'd-read', tone: 'paper', eyebrow: 'Read it aloud', title: 'This thing, shaped this way, may be changed by these actors through these write types, subject to these gates, proving these fields, over these channels.',
          body: '<div class="e1s-grid" style="grid-template-columns:repeat(auto-fill,minmax(300px,1fr))">' + D.blocks.map(function (b) {
            return '<article class="e1s-card"><div class="e1s-card__top"><span class="e1s-card__k">Block ' + b[0] + '</span><span class="e1s-tag">' + esc(b[2]) + '</span></div><h3 class="e1s-h3" style="font-family:var(--font-mono);font-size:17px">' + esc(b[1]) + '</h3><p class="e1s-card__d">' + esc(b[3]) + '</p></article>';
          }).join('') + '<article class="e1s-card e1s-card--flat"><p class="e1s-card__d">JSON, under 900 lines, never a programming language. “If a declaration needs a loop, the design is wrong.” Versions are forward-only integers; “latest” is rejected in production. The screen an approver saw in 2027 can be rebuilt in 2035.</p></article></div>' +
          '<div class="e1s-split" style="margin-top:32px"><div>' + c.code(sample, 'json', { title: 'erp.ar v7 — excerpt' }) + '</div><div class="e1s-stack">' + c.tree([{ label: 'erp.ar v7', open: true, children: [{ label: 'identity', meta: '8 fields' }, { label: 'shape', meta: 'Sales Invoice · 41 fields' }, { label: 'permissions', meta: '6 grants' }, { label: 'write_types', meta: '6', href: '#/records/write-types/erp.sales_invoice.submit' }, { label: 'gates', meta: '7 enabled' }, { label: 'proof_binding', meta: '12 fields' }, { label: 'channels', meta: 'web · mobile · whatsapp · mcp' }] }]) +
            note('Block 7 was once called doors. It is channels now (DR-012), so “doors” means only the Four Doors of the console.') + '</div></div>' }) +
        band({ id: 'd-disp', tone: 'surface', eyebrow: 'Never a blank', title: 'Every field carries exactly one of three dispositions.',
          body: '<div class="e1s-grid e1s-grid--3">' +
            card({ k: 'A VALUE', title: 'The field’s declared type', body: 'Rendered as the value.' }) +
            card({ k: 'OUT_OF_SCOPE', title: 'With an ADR reference', body: 'Hidden, with the decision reference available — ADR-0142, for example.' }) +
            card({ k: 'NOT_MEASURABLE', title: 'With a reason and what would change it', body: 'Both strings shown, each at least 12 characters.' }) + '</div>' +
            '<div style="margin-top:16px">' + c.callout({ kind: 'rule', title: '“n/a” and “tbd” are rejected', body: '<p>An honest unknown needs a sentence. What would change your answer?</p>' }) + '</div>' }) +
        band({ id: 'd-chain', tone: 'paper', eyebrow: 'The five-link chain', title: 'A clause becomes a control, a gate, a write type and a proof field.', lead: 'Worked for ledger1, the first India pack: the MCA audit-trail rule, clause by clause.',
          body: c.table({ caption: 'Clause to proof field', columns: [{ key: 0, label: 'Clause (quoted)' }, { key: 1, label: 'Control' }, { key: 2, label: 'Gate' }, { key: 3, label: 'Write types', mono: true }, { key: 4, label: 'Proof fields', mono: true }],
            rows: [['An audit trail of each and every transaction', 'C01, C02', '—', '*', 'F04 F05 F09 F10 F16'], ['An edit log of each change made in books of account', 'C03', 'precondition', '*', 'F12 F13 F14 F07'], ['The date when such changes were made', 'C04', '—', '*', 'F16'], ['The audit trail shall not be disabled', 'C05, C06', '—', '*', 'F02 F03']] }) +
            '<div style="margin-top:16px">' + btn('Read the ledger1 pack', '#/packs/ledger1', 'secondary', 'arrow-right') + '</div>' }) +
        band({ id: 'd-rules', tone: 'sunken', eyebrow: 'Validate, then certify', title: 'Semantic rules fail the version. Lint only warns.',
          body: '<div class="e1s-split"><div>' + c.table({ caption: 'Semantic rules (selection)', dense: true, columns: [{ key: 0, label: 'Rule', mono: true, width: '90px' }, { key: 1, label: 'Fails when not true' }], rows: sem }) + '</div><div class="e1s-stack">' +
            c.stepper(['Author', 'Validate', 'Simulate', 'Certify', 'Compile', 'Resolve'], 3) +
            '<p class="e1s-p">Studio shows the first four modes, and you cannot skip forward. Simulation runs on synthetic fixtures only. A named person — never the author — certifies the version. There is no such thing as a small change to a governed declaration.</p>' +
            btn('Open Studio', '#/records/studio', 'secondary', 'arrow-right') + '</div></div>' }) +
        band({ id: 'd-map', tone: 'paper', eyebrow: 'The honest comparison', title: 'Palantir models the world. elan1 models the permission to change it.', lead: 'Where our Declaration maps to Palantir’s Ontology — including where we are behind.',
          body: c.table({ caption: 'Palantir mapping', columns: [{ key: 0, label: 'Palantir Ontology' }, { key: 1, label: 'elan1 Declaration', mono: true }, { key: 2, label: 'Note' }],
            rows: [['Object types', 'shape', ''], ['Link types', 'shape.links', 'We are behind here.'], ['Action types', 'write_types', ''], ['Submission criteria', 'gates', ''], ['Action log', 'the hash-chained record', 'Ours is checkable by a stranger from L2.'], ['Interfaces', 'system_of_record + adapter', ''], ['Functions', 'evaluate()', 'No model decides.'], ['—', 'autonomy · channels · proof_binding · meter basis', 'elan1-only concepts.']] }) }) +
        closingCta();
    }
  });

  /* ------------------------------------------------------------------------
     ASSURANCE LEVELS  #/assurance-levels  (?preview=L1|L2|L3)
     ------------------------------------------------------------------------ */
  function sealAt(L) {
    var base = { seq: 4101, writeType: 'erp.sales_invoice.submit', outcome: 'committed', blast: 2, reversible: '24 h', amount: 240000, actor: { name: 'ar-agent', kind: 'agent' }, approver: 'Venkat Raman', at: '24 Sep 2026, 15:02 IST', digest: H.h4101, prev: H.h4100, declaration: 'erp.ar v7', policy: 'policy v11' };
    base.level = L;
    if (L !== 'L1') { base.signer = 'elan1 signing key · domain in'; base.keyId = 'k_in_20270401_9c3a'; base.anchor = '24 Sep 2026, 15:05 IST (two authorities)'; base.verdict = 'PASS · exit 0'; }
    if (L === 'L3') base.counter = 'Counter-signed by a party that is not elan1';
    return c.seal(base);
  }
  E1.route('/assurance-levels', {
    title: 'Assurance levels', layout: 'public', keywords: 'L1 L2 L3 guarded attested proven claim',
    render: function (p, q) {
      var pvL = /^L[123]$/.test(q.preview || '') ? q.preview : (E1.state.level || 'L1');
      var rows = [
        ['Enforcement, gates, approval, rollback', 'Yes', 'Yes', 'Yes'],
        ['Record of every write, refusal, escalation', 'Hash-chained', 'Hash-chained', 'Hash-chained'],
        ['Signature', 'None', 'Ed25519 over the frozen preimage', 'Plus a second independent implementation'],
        ['Time anchor', 'None', 'RFC 3161, two authorities, one India-based', 'Plus a counter-signature by a party that is not elan1'],
        ['Bundle and offline verifier', 'No', 'Yes — the verifier free, as source, to anyone', 'Plus published test vectors'],
        ['Checkable by someone who distrusts elan1', 'No', 'Yes, with a key fingerprint obtained out of band', 'Yes, without elan1 existing'],
        ['Buyer', 'The operator', 'The auditor’s counterparty', 'The market'],
        ['Floor, per tenant per year ' , inr(180000), inr(600000), inr(2400000)],
        ['Available when', 'Gate G2 passes', 'Gate G4 passes', 'Gate G6 passes — an event, not a date']
      ];
      var cantSay = {
        L1: ['“Signed”, “independently verifiable” or “cryptographic proof”', '“A third party can verify this without us”', '“This satisfies the MCA audit-trail rule”'],
        L2: ['That the transaction was genuine', 'That the rules applied were adequate', 'That any regulator has reviewed or accepted it'],
        L3: ['“Standardised” — it is published until others implement it', '“The agent is safe because it earned A3”', '“We cannot see your data”, except as a per-deployment fact with customer-held keys']
      };
      var preview = c.segmented([{ id: 'L1', label: 'L1 Guarded', href: '#/assurance-levels?preview=L1' }, { id: 'L2', label: 'Preview L2', href: '#/assurance-levels?preview=L2' }, { id: 'L3', label: 'Preview L3', href: '#/assurance-levels?preview=L3' }], pvL, { label: 'Show the proof record at' });
      return hero({ eyebrow: 'Assurance levels', title: 'A level is a property of the proof and the claim, never of the policy.',
          lead: 'The same declaration carries across all three. What changes is who can check the record, and without whom. Each level arrives when an observable gate passes, not on a date.',
          actions: btn('Book a working session', '#/demo', 'primary', 'arrow-right') + btn('The evidence, in detail', '#/evidence', 'secondary'),
          toc: [{ id: 'al-cards', label: 'The three levels' }, { id: 'al-table', label: 'Side by side' }, { id: 'al-say', label: 'What you may say' }, { id: 'al-seal', label: 'The same record, three ways' }, { id: 'al-up', label: 'Upgrading' }] }) +
        band({ id: 'al-cards', tone: 'paper', eyebrow: 'L1 · L2 · L3', title: 'L1 says the write was controlled. L2 says a stranger can check that. L3 says the record survives us.',
          body: '<div class="e1s-grid e1s-grid--3">' + levelCard('L1', { full: true }) + levelCard('L2', { full: true }) + levelCard('L3', { full: true }) + '</div>' }) +
        band({ id: 'al-table', tone: 'surface', eyebrow: 'Side by side', title: 'What each level adds.',
          body: '<div class="e1-table-wrap"><table class="e1-table"><caption class="e1-sr">Assurance levels compared</caption><thead><tr><th scope="col"></th><th scope="col">' + c.level('L1') + '</th><th scope="col">' + c.level('L2') + '</th><th scope="col">' + c.level('L3') + '</th></tr></thead><tbody>' +
            rows.map(function (r) { return '<tr><th scope="row">' + esc(r[0]) + '</th><td>' + esc(r[1]) + '</td><td>' + esc(r[2]) + '</td><td>' + esc(r[3]) + '</td></tr>'; }).join('') + '</tbody></table></div>' +
            '<p class="e1s-src">Floors are modelled list prices. L1 is building; L2 and L3 are frozen specifications. Nothing here is generally available today.</p>' }) +
        band({ id: 'al-say', tone: 'paper', eyebrow: 'The claim boundary', title: 'What each level lets you say — and what it does not.',
          body: '<div class="e1s-grid e1s-grid--3">' + ['L1', 'L2', 'L3'].map(function (L) {
            return '<article class="e1s-card"><div class="e1s-card__top">' + c.level(L) + '</div>' + quote(D.levels[L].say, null, true) +
              '<p class="e1s-eyebrow" style="margin:8px 0 0">Never said at ' + L + '</p>' + list(cantSay[L], { icon: 'x', tight: true }) +
              '<p class="e1s-eyebrow" style="margin:8px 0 0">Limits</p>' + list(D.levels[L].not, { icon: 'minus', tight: true }) + '</article>';
          }).join('') + '</div>' }) +
        band({ id: 'al-seal', tone: 'sunken', eyebrow: 'Honesty in the interface', title: 'The same proof record at each level.', lead: 'At L1 there is no signature row, no anchor time and no verifier verdict — not even an empty one. A screen that renders an empty “Signed by” row teaches a customer to expect something we do not ship.',
          actions: preview,
          body: '<div class="e1s-split"><div>' + sealAt(pvL) + '</div><div class="e1s-stack">' +
            (pvL === 'L1' ? c.locked({ level: 'L2', always: true, why: 'A stranger holding the key fingerprint, obtained out of band, can check the record without trusting elan1. None of that is claimed at L1, so none of it is shown.', items: ['Ed25519 signature over the frozen preimage', 'RFC 3161 anchor time, batched', 'Offline verifier verdict', 'Exportable evidence bundle'] })
              : c.callout({ kind: 'caveat', title: 'Preview — ' + pvL + ' ' + E1.LEVELS[pvL].name + ' is not available', body: '<p>' + esc(D.levels[pvL].gateText) + ' Figures and key ids are illustrative.</p>' })) +
            note('The level pill appears on every proof, export and report. Records written before an upgrade are labelled L1 for ever.', 'layers') + '</div></div>' }) +
        band({ id: 'al-up', tone: 'paper', eyebrow: 'Upgrading', title: 'A chain written at L1 cannot be retroactively sealed.',
          body: '<div class="e1s-split"><div>' + quote('Signatures start where signing starts. Records written before the upgrade stay L1 for ever, and the bundle prints the boundary date and the count on each side.') + '</div><div class="e1s-stack">' +
            '<p class="e1s-p">The upgrade is a governed change with its own runbook and rehearsal. Its success criterion is not that it worked, but that it was boring.</p>' +
            '<p class="e1s-p">For ledger1, the non-disablement check on an L1 dry run reads <span class="e1s-code">not_applicable — assurance level 1</span>. That single row is the clearest available demonstration of what L2 buys.</p>' +
            btn('Plan an upgrade in the console', '#/assurance/upgrade', 'secondary', 'arrow-right') + '</div></div>' }) +
        closingCta();
    }
  });

  /* ------------------------------------------------------------------------
     EVIDENCE  #/evidence
     ------------------------------------------------------------------------ */
  var SEAL_FIELDS = [
    ['F01', 'tenant_id', 'Whose chain this is'], ['F02', 'seq', 'Starts at 1 and never skips'], ['F03', 'prev_digest', '32 zero octets at genesis'], ['F04', 'write_id', 'The write this records'],
    ['F05', 'write_type', 'erp.sales_invoice.submit'], ['F06', 'declaration_id', 'Which declaration governed it'], ['F07', 'declaration_version', 'Never “latest”'], ['F08', 'policy_version', 'Resolved by the kernel, never supplied'],
    ['F09', 'actor_id', 'Who asked'], ['F10', 'actor_kind', 'human · agent · system — never inferred'], ['F11', 'autonomy_level', 'A0–A5 held at the moment of the write'], ['F12', 'record_id', 'The zero UUID on a refusal'],
    ['F13', 'record_version', '0 on a refusal'], ['F14', 'payload_hash', 'Over the salted, canonicalised payload'], ['F15', 'lexicon_hash', 'So “credit limit” means in 2033 what it meant on the day'], ['F16', 'recorded_at', 'Platform clock at chain-write time, never the caller’s']
  ];
  var BUNDLE = [
    ['manifest.json', 'What is in the bundle, the range, the counts, the digests of every other member, and the profile claimed.', 'Always'],
    ['seals.jsonl', 'One record per line, in seq order — the sixteen fields, the digest, the level, and at L2 the signature and key id.', 'Always'],
    ['chain.json', 'Genesis digest, head digest, the range, and the boundary rows where the level or the signing key changes.', 'Always'],
    ['anchors/', 'One file per closed batch: the RFC 3161 token, the Merkle root, the leaf count and each record’s inclusion path.', 'L2'],
    ['keys.json', 'Key id, validity window, status, successor and the public key fingerprint — never the key.', 'L2'],
    ['declarations/', 'Every referenced declaration version, verbatim.', 'Always'],
    ['lexicon/', 'Every term set referenced by F15, verbatim.', 'Always'],
    ['VERIFY.txt', 'How to check this without us, what each failure looks like, and what a PASS does not prove.', 'Always']
  ];
  var EXIT = [
    ['0', 'PASS', 'Every integrity check and every profile check passed.', 'Rely on it, within the limits statement.', 'good'],
    ['0', 'PASS — payload unbound', 'Payload salts were destroyed under an erasure obligation. Chain intact.', 'Note it. Never printed as a failure.', 'good'],
    ['0', 'PASS — unsigned, assurance level 1', 'Structure and chain verified; signature, key-window and anchor checks not applicable.', 'Internal control evidence only.', 'neutral'],
    ['1', 'FAIL_INTEGRITY', 'A digest, chain link, signature, inclusion path or anchor did not verify.', 'Stop. This is forensic, not compliance.', 'critical'],
    ['2', 'FAIL_PROFILE', 'Integrity is sound; a profile requirement is unmet.', 'The records are trustworthy and do not meet this regime’s requirements.', 'serious'],
    ['3', 'INCOMPLETE', 'A referenced declaration, lexicon or anchor member is missing.', 'Ask for a complete bundle.', 'warning'],
    ['4', 'UNSUPPORTED', 'Unknown profile version or domain string.', 'Obtain the matching verifier. Never interpret.', 'neutral'],
    ['5', 'USAGE', 'Bad arguments or an unreadable file.', 'Operator error.', 'neutral']
  ];
  E1.route('/evidence', {
    title: 'Evidence — seal, bundle and verifier', layout: 'public', keywords: 'seal bundle verifier exit codes anchor',
    render: function () {
      return hero({ eyebrow: 'Evidence', title: 'A record you can check without asking us.',
          lead: 'The seal is sixteen frozen fields. The bundle is a directory that needs nothing from us. The verifier is free, ships as source, and reads no network. All three arrive at Assurance Level 2; this page says exactly what each will and will not prove.',
          actions: btn('Verify a record', '#/verify', 'primary', 'arrow-right') + btn('Exit codes', '#/verify/exit-codes', 'secondary') + btn('Watch the tampered bundle fail', '#/verify/tampered', 'ghost'),
          meta: c.level('L2') + '<span>Frozen specification · arrives at gate G4</span>',
          toc: [{ id: 'e-seal', label: 'The seal' }, { id: 'e-bundle', label: 'The bundle' }, { id: 'e-verifier', label: 'The offline verifier' }, { id: 'e-exit', label: 'Exit codes' }, { id: 'e-anchor', label: 'Anchoring' }] }) +
        '<div class="e1s-wrap" style="padding-top:24px">' + c.callout({ kind: 'caveat', title: 'At L1 — today — none of this ships.', body: '<p>L1 proof records are hash-chained, not signed, and cannot yet be checked by someone who does not trust elan1. At L1 the verifier can only say <span class="e1s-code">PASS — unsigned, assurance level 1</span>: internal control evidence, not third-party proof.</p>' }) + '</div>' +
        band({ id: 'e-seal', tone: 'paper', eyebrow: 'elan1.proof.seal.v6', title: 'Sixteen fields, length-prefixed, SHA-256, frozen for ever.', lead: 'No optional fields, no seventeenth field, no v6.1. A refusal carries zeroes, not omissions. The preimage is a 19-octet domain string followed by the sixteen encoded fields.',
          body: '<div class="e1s-split e1s-split--wide"><div>' + c.table({ caption: 'Seal fields', dense: true, columns: [{ key: 0, label: '#', mono: true, width: '56px' }, { key: 1, label: 'Field', mono: true }, { key: 2, label: 'Meaning' }], rows: SEAL_FIELDS }) + '</div>' +
            '<div class="e1s-stack">' + sealAt('L1') + card({ icon: 'layers', title: 'Beside the record, never inside it', body: 'Gate results, the approver’s identity (the approval is its own record), the enforcement mode and the payload itself.' }) + '</div></div>' }) +
        band({ id: 'e-bundle', tone: 'surface', eyebrow: 'elan1.evidence.bundle.v1', title: 'Self-contained, inert and claim-bearing.', lead: 'Eight members. No executable content, no scripts, no URL a verifier is expected to fetch. We keep no bundles: an export is generated on request and handed over.',
          body: c.table({ caption: 'Bundle members', columns: [{ key: 0, label: 'Member', mono: true, width: '160px' }, { key: 1, label: 'Contents' }, { key: 2, label: 'Required', width: '100px', render: function (r) { return r[2] === 'L2' ? c.level('L2', { short: true }) : esc(r[2]); } }], rows: BUNDLE }) +
            '<div class="e1s-grid e1s-grid--2" style="margin-top:16px">' + c.callout({ kind: 'good', title: 'Included', body: '<p>Refusals in full, every referenced declaration version and lexicon, gate results beside each record, the approval record, and the timestamp authority’s certification path.</p>' }) + c.callout({ kind: 'caveat', title: 'Never in a bundle', body: '<p>Payloads, salts, key material, any executable, and the target system’s state.</p>' }) + '</div>' +
            '<p class="e1s-src">Sizes are modelled: about 640 bytes a record; a 1,00,000-record year about 150 MB.</p>' }) +
        band({ id: 'e-verifier', tone: 'paper', eyebrow: 'elan1-verify', title: 'A verifier you must buy from the vendor whose records it checks is not a verifier.',
          body: '<div class="e1s-split"><div class="e1s-stack">' + c.code('elan1-verify --bundle ./kaveri-2027-q3 \\\n             --profile ./in-mca-audit-trail.v1.json \\\n             --key-fingerprint <from your own source>', 'shell', { title: 'Run it on your own machine, offline' }) +
            '<p class="e1s-p">It reads the bundle’s eight members, the profile, a key fingerprint you obtained out of band, and the local clock — only to check that the anchor time precedes now. It reads no network, calls no API and shares no code with the chain writer. It does not refuse; it reports, and records nothing.</p></div>' +
            '<div><h3 class="e1s-h3" style="margin-bottom:12px">Four ways to check the verifier is ours</h3><ol class="e1s-steps">' +
            '<li><div><b>Compare checksums</b><span>SHA-256 against SHA256SUMS, and the release signature against a fingerprint you obtained yourself.</span></div></li>' +
            '<li><div><b>Rebuild from source</b><span>Reproducible build; compare digests.</span></div></li>' +
            '<li><div><b>Read the source</b><span>Standard library only, and small enough to read in a day.</span></div></li>' +
            '<li><div><b>Write your own</b><span>From the seal and profile specifications. This is the route that matters: a verifier we supply is a convenience; the format is the product.</span></div></li></ol></div></div>' }) +
        band({ id: 'e-exit', tone: 'surface', eyebrow: 'Exit codes', title: 'Six codes. Altered is not unmet is not missing.', lead: 'FAIL_INTEGRITY means somebody’s records were altered. FAIL_PROFILE means an honest record set does not meet a regime’s requirements. Reporting the second as the first accuses a customer of tampering; reporting the first as the second hides a P0.',
          actions: btn('Full exit-code guide', '#/verify/exit-codes', 'secondary', 'arrow-right'),
          body: c.table({ caption: 'Verifier exit codes', columns: [{ key: 0, label: 'Exit', mono: true, width: '60px' }, { key: 1, label: 'Verdict', render: function (r) { return c.badge(r[4], r[1]); } }, { key: 2, label: 'Means' }, { key: 3, label: 'What the reader does' }], rows: EXIT }) }) +
        band({ id: 'e-anchor', tone: 'paper', eyebrow: 'RFC 3161', title: 'An anchor is an upper bound on time.', lead: 'Existence, form, and no later than. It never proves when something happened — only that this digest existed, in this form, no later than this instant, according to a party with no interest in the matter.',
          body: '<div class="e1s-grid e1s-grid--3">' + card({ icon: 'clock', title: 'Two authorities, one India-based', body: 'Different operator, different trust root, different country. Two authorities that fail together are one authority.' }) +
            card({ icon: 'chain', title: 'The tail-cut detector', body: 'A chain truncated at 4,000 of 4,200 records is internally consistent and looks complete. The anchor is the only mechanism that catches it.' }) +
            card({ icon: 'hash', title: 'Only a hash and a nonce', body: 'The authority never sees a record, a payload or a tenant name. Batches close at least every 15 minutes (modelled).' }) + '</div>' }) +
        closingCta();
    }
  });

  /* ------------------------------------------------------------------------
     PACKS  #/packs  and  #/packs/:id
     ------------------------------------------------------------------------ */
  E1.route('/packs', {
    title: 'Packs', layout: 'public', keywords: 'ledger1 invoice1 collect1 regulatory pack admission gates refused',
    render: function () {
      return hero({ eyebrow: 'Packs', title: 'A regime is a pack. A country is a set of packs.',
          lead: 'A pack is configuration, not code: one declaration, one certified verifier profile and one regime-specific export mapping, aimed at one buyer with one auditor under one dated obligation. A clause becomes a control, the control a gate, the gate binds to a write type, and the write type to a proof field.',
          actions: btn('Read ledger1', '#/packs/ledger1', 'primary', 'arrow-right') + btn('Packs in the console', '#/records/packs', 'secondary'),
          toc: [{ id: 'pk-list', label: 'The packs' }, { id: 'pk-gates', label: 'Five admission gates' }, { id: 'pk-tests', label: 'Eight tests' }, { id: 'pk-refused', label: 'Refused by name' }] }) +
        band({ id: 'pk-list', tone: 'paper', eyebrow: 'In order', title: 'Three packs, each behind its own gate.',
          body: '<div class="e1s-grid e1s-grid--3">' + ['ledger1', 'invoice1', 'collect1'].map(function (id) {
            var p = D.packs[id];
            return '<a class="e1s-card" href="#/packs/' + id + '"><div class="e1s-card__top"><span class="e1s-card__k" style="font-size:15px">' + esc(p.id) + '</span>' + status(p.statusKind, p.statusKind === 'sketch' ? 'Spec sketch' : 'Specification') + '</div>' +
              '<h3 class="e1s-h3">' + esc(p.order) + '</h3><p class="e1s-card__d">' + esc(p.title) + '</p><p class="e1s-card__d" style="font-size:12px">' + esc(p.obligation) + '</p>' +
              '<div class="e1s-lvl__gate">' + ic('gate', 16) + '<span><b>Live at gate ' + esc(p.gate) + '.</b> Minimum ' + esc(p.minLevel) + '.</span></div><span class="e1s-card__foot">Read the pack ' + ic('arrow-right', 14) + '</span></a>';
          }).join('') + '</div>' +
          '<div style="margin-top:16px">' + note('A pack is never a line on a public price list under its own name. On pricing it sits under “Regulatory pack — ₹1,35,000 per tenant per year (blended), modelled”. Pack ids are lowercase configuration labels, with no logo.', 'package') + '</div>' }) +
        band({ id: 'pk-gates', tone: 'surface', eyebrow: 'Admission', title: 'Five gates. A gate scored “probably” is scored fail.', lead: 'Admission is itself a governed write under dual control, approved by the founder.',
          body: c.table({ caption: 'Pack admission gates', columns: [{ key: 0, label: 'Gate', mono: true, width: '70px' }, { key: 1, label: 'Name', render: function (r) { return '<b>' + esc(r[1]) + '</b>'; } }, { key: 2, label: 'Passes when' }, { key: 3, label: 'Fails when' }], rows: D.packGates }) }) +
        band({ id: 'pk-tests', tone: 'paper', eyebrow: 'Before a pack ships', title: 'Eight tests, including one the auditor must pass.',
          body: '<div class="e1s-grid e1s-grid--4">' + D.packTests.map(function (t) { return '<div class="e1s-card"><span class="e1s-card__k">' + t[0] + '</span><p class="e1s-card__d" style="color:var(--text-primary)">' + esc(t[1]) + '</p></div>'; }).join('') + '</div>' }) +
        band({ id: 'pk-refused', tone: 'sunken', eyebrow: 'The portfolio register', title: 'Refused by name — not softened, parked or renamed.',
          body: '<div class="e1s-split e1s-split--wide"><div>' + c.table({ caption: 'Refused packs', columns: [{ key: 0, label: 'Candidate', mono: true }, { key: 1, label: 'Gate failed', mono: true }, { key: 2, label: 'Why' }], rows: D.packsRefused.concat([['(two more)', 'Not recorded here', 'Held in the portfolio register. We show the gap rather than hide it.']]), rowHref: function (r) { return /^\(/.test(r[0]) ? null : '#/packs/' + r[0]; } }) + '</div>' +
            '<div class="e1s-stack"><h3 class="e1s-h3">Reserved, not built</h3><p class="e1s-p">Names held for demand-led packs. None is designed, staffed or promised.</p><div class="e1-row" style="flex-wrap:wrap;gap:6px">' + D.packsReserved.map(function (x) { return '<a class="e1s-tag" href="#/packs/' + x + '">' + esc(x) + '</a>'; }).join('') + '</div>' +
            note('A DPDP evidence pack is intended to ship ahead of DPDP enforcement. It is not yet specified.', 'info') + '</div></div>' }) +
        closingCta();
    }
  });

  function packDetail(p) {
    var id = p.id;
    var wt = c.table({ caption: 'Write types', columns: [{ key: 0, label: 'Write type', mono: true }, { key: 1, label: 'Blast radius', render: function (r) { return c.blast(r[1], { compact: true }); } }, { key: 2, label: 'Reversal' }, { key: 3, label: 'Dual control' }], rows: p.writeTypes });
    var scores = c.table({ caption: 'Gate scores', dense: true, columns: [{ key: 0, label: 'Gate', mono: true, width: '60px' }, { key: 1, label: 'Test' }, { key: 2, label: 'Score', render: function (r) { var s = /^pass/i.test(r[2]) ? (/provision|confirm/i.test(r[2]) ? 'info' : 'good') : /partial|open|not yet/i.test(r[2]) ? 'warning' : 'neutral'; return c.badge(s, r[2], { subtle: true }); } }, { key: 3, label: 'Note' }], rows: p.scores });
    var gates = id === 'collect1'
      ? '<ol class="e1s-steps">' + p.gates.map(function (g) { var parts = g.split(': '); return '<li><div><b>' + esc(parts[0]) + '</b><span>' + esc(parts[1] || '') + '</span></div></li>'; }).join('') + '</ol>'
      : '<ol class="e1s-steps">' + p.gates.map(function (g) { return '<li><div><b class="e1s-mono">' + esc(g) + '</b></div></li>'; }).join('') + '</ol>';
    var pilot = id === 'ledger1' ? band({ id: 'pd-pilot', tone: 'paper', eyebrow: 'The pilot', title: '90 days, one customer, one auditor.', lead: 'Refusals are part of what is being tested and should not be worked around.',
      body: '<ol class="e1s-steps" style="max-width:760px">' +
        '<li><div><b>Day 0 — start</b><span>The pilot begins with a named statutory auditor who has agreed in writing. Production key issued after review.</span></div></li>' +
        '<li><div><b>Days 1–60 — governed writes</b><span>Sales and purchase invoices, payments and journals through the governed path. At least one real refusal per gate.</span></div></li>' +
        '<li><div><b>Day 60 — export</b><span>A bundle for the period the auditor chooses. “Verify it yourself first. If it does not pass for you it will not pass for them.”</span></div></li>' +
        '<li><div><b>Day 70 — the auditor’s machine</b><span>The verifier runs air-gapped, on the real bundle and on the tampered bundle.</span></div></li>' +
        '<li><div><b>Day 80 — verdict</b><span>The auditor’s verdict, in their own words, including what a PASS does not establish.</span></div></li>' +
        '<li><div><b>Day 85 — our answer</b><span>What we change, and whether the pack proceeds.</span></div></li></ol>' +
        '<p class="e1s-src">Outline only. The full day-by-day protocol is shared in a working session. The pilot customer and auditor are not yet named.</p>' }) : '';
    return hero({ crumbs: [['Packs', '#/packs']], crumb: id, eyebrow: p.order, title: id, lead: p.title,
        actions: btn('Book a working session', '#/demo?pack=' + id, 'primary', 'arrow-right') + btn('View in the console', '#/records/packs/' + id, 'secondary'),
        meta: status(p.statusKind, p.status) + '<span>Minimum ' + c.level(p.minLevel) + '</span><span>Live at gate ' + esc(p.gate) + '</span>',
        toc: [{ id: 'pd-ob', label: 'Obligation' }, { id: 'pd-wt', label: 'Write types and gates' }, { id: 'pd-profile', label: 'Profile' }, { id: 'pd-promise', label: 'Promise and limits' }].concat(id === 'ledger1' ? [{ id: 'pd-pilot', label: 'Pilot' }] : []) }) +
      band({ id: 'pd-ob', tone: 'paper', eyebrow: 'The dated obligation', title: p.obTitle,
        body: '<div class="e1s-split e1s-split--wide"><div class="e1s-stack"><p class="e1s-p" style="font-size:16px;line-height:26px">' + esc(p.obligation) + '</p>' +
          '<h3 class="e1s-h4" style="margin-top:20px">Clauses bound</h3>' + list(p.clauses, { icon: 'file-text' }) + '</div>' +
          '<div class="e1s-stack">' + c.kv([['Buyer', p.buyer], ['Auditor', p.auditor], ['Minimum level', p.minLevel + ' ' + E1.LEVELS[p.minLevel].name], ['Price', 'Regulatory pack ₹1,35,000 a year (blended) plus a verifier profile ₹3,00,000 per regime a year — modelled']]) + scores + '</div></div>' }) +
      band({ id: 'pd-wt', tone: 'surface', eyebrow: 'Configuration', title: 'Write types and gates, in declared order.', lead: p.gatesNote,
        body: '<div class="e1s-split e1s-split--wide"><div>' + wt + '</div><div>' + gates + '</div></div>' }) +
      band({ id: 'pd-profile', tone: 'paper', eyebrow: 'Verifier profile', title: 'A checkable claim, never certified by its own author.',
        body: '<div class="e1s-split"><div>' + c.kv(p.profile.map(function (x) { return [x[0], x[1], { mono: /Profile|scope/.test(x[0]) }]; })) + '</div><div>' +
          (p.checks.length ? c.table({ caption: 'Profile checks', dense: true, columns: [{ key: 0, label: 'Check', mono: true }, { key: 1, label: 'Kind' }, { key: 2, label: 'Statement' }, { key: 3, label: 'On fail', mono: true }], rows: p.checks }) : note('Checks are written when the profile is authored. ' + esc(p.extra), 'info')) + '</div></div>' +
          (p.checks.length ? '<p class="e1s-src">' + esc(p.extra) + ' On an L1 dry run, C06 reads “not_applicable — assurance level 1”.</p>' : '') }) +
      band({ id: 'pd-promise', tone: 'sunken', eyebrow: 'The buyer promise', title: 'Three sentences, and the limits in the same breath.',
        body: '<div class="e1s-grid e1s-grid--3">' + D.buyerPromise.map(function (s, i) { return '<div class="e1s-card"><span class="e1s-card__k">0' + (i + 1) + '</span><p class="e1s-card__d" style="color:var(--text-primary);font-size:15px;line-height:23px">' + esc(s) + '</p></div>'; }).join('') + '</div>' +
          '<div style="margin-top:16px">' + c.callout({ kind: 'caveat', title: 'What this pack does not establish — verbatim, printed in every report', body: '<p>' + esc(p.limits) + '</p>' }) + '</div>' }) +
      pilot + closingCta();
  }

  E1.route('/packs/:id', {
    title: function (p) { return (p.id || 'Pack') + ' — pack'; }, layout: 'public', example: '/packs/ledger1', keywords: 'pack detail',
    render: function (params) {
      var id = String(params.id || '').toLowerCase();
      if (D.packs[id]) return packDetail(D.packs[id]);
      var ref = D.packsRefused.filter(function (r) { return r[0] === id; })[0];
      if (ref) return hero({ crumbs: [['Packs', '#/packs']], crumb: id, eyebrow: 'Refused by name', title: id, lead: 'This candidate failed gate ' + ref[1] + ': “' + ref[2] + '” It is in the portfolio register, not softened, parked or renamed.', meta: status('refused'), actions: btn('The five admission gates', '#/packs', 'secondary', 'arrow-left') }) +
        band({ tone: 'paper', body: c.empty({ title: 'There is no ' + id + ' pack', why: 'A refused candidate is not reopened by a sales conversation. Reopening needs a new decision record that names the gate that has changed.', action: [{ label: 'See the three packs', href: '#/packs' }, { label: 'Decision register', href: '#/company/decisions' }] }) });
      if (D.packsReserved.indexOf(id) !== -1) return hero({ crumbs: [['Packs', '#/packs']], crumb: id, eyebrow: 'Reserved', title: id, lead: 'A name held for a demand-led pack. It is not designed, not staffed and not promised.', meta: status('reserved'), actions: btn('Tell us about your obligation', '#/contact?topic=pack', 'primary', 'arrow-right') }) +
        band({ tone: 'paper', body: c.empty({ title: id + ' is reserved, not built', why: 'Every pack must pass five gates, starting with a dated obligation and an auditor who is obliged to ask for the evidence.', fill: 'If you carry such an obligation, the fastest route is a working session with your auditor’s name.', action: [{ label: 'Book a working session', href: '#/demo' }, { label: 'Admission gates', href: '#/packs' }] }) });
      return hero({ crumbs: [['Packs', '#/packs']], crumb: id || 'Unknown', eyebrow: 'Packs', title: 'No pack called ' + (id || 'that'), lead: 'Pack ids are lowercase and end in 1 — ledger1, invoice1, collect1.' }) +
        band({ tone: 'paper', body: c.empty({ title: 'We could not find “' + id + '”', why: 'It is not a live, planned, reserved or refused pack.', action: [{ label: 'All packs', href: '#/packs' }] }) });
    }
  });

  /* ------------------------------------------------------------------------
     INDUSTRIES  #/industries
     ------------------------------------------------------------------------ */
  E1.route('/industries', {
    title: 'Industries — configurations', layout: 'public', keywords: 'industry configurations manufacturing lending',
    render: function () {
      var cards = D.industries.map(function (x) {
        return '<article class="e1s-card"><div class="e1s-card__top">' + (x.pack ? '<a class="e1s-card__k" href="#/packs/' + x.pack + '">' + esc(x.pack) + '</a>' : '<span class="e1s-card__k">configuration</span>') + status(x.st) + '</div>' +
          '<h3 class="e1s-h3">' + esc(x.t) + '</h3><p class="e1s-card__d"><b style="color:var(--text-primary)">Who:</b> ' + esc(x.who) + '</p><p class="e1s-card__d"><b style="color:var(--text-primary)">What is governed:</b> ' + esc(x.what) + '</p>' +
          (x.sample ? '<p class="e1s-card__d" style="font-size:12px">' + esc(x.sample) + '</p>' : '') + '</article>';
      }).join('');
      return hero({ eyebrow: 'Industries', title: 'Ten industry configurations off one codebase.',
          lead: 'Deployment is setup rather than a build. A configuration is described, not named: the same kernel, the same four doors, with the write types, gates, autonomy caps and obligations of one industry.',
          actions: btn('Book a working session', '#/demo', 'primary', 'arrow-right') + btn('Packs', '#/packs', 'secondary') }) +
        band({ tone: 'paper', eyebrow: 'Where each stands', title: 'Three are specified. The rest are reserved, and say so.',
          body: '<div class="e1s-grid" style="grid-template-columns:repeat(auto-fill,minmax(300px,1fr))">' + cards + '</div>' +
            '<div style="margin-top:20px">' + note('Configurations are not products and carry no logo. Market entry order: India BFSI and Companies Act entities first, then Indian insurance, Indian healthcare when there is demand, the GCC and Singapore, EU high-risk deployers, then the US — each behind its own gate.', 'globe') + '</div>' }) +
        band({ tone: 'sunken', eyebrow: 'Not every industry', title: 'We refuse some, by name.', lead: 'Retail, education, energy, agriculture, legal and public procurement failed an admission gate. The reasons are public.', actions: btn('Read the refusals', '#/packs', 'secondary', 'arrow-right'),
          body: '<div class="e1-row" style="flex-wrap:wrap;gap:6px">' + D.packsRefused.map(function (r) { return '<a class="e1s-tag" href="#/packs/' + r[0] + '">' + esc(r[0]) + ' · ' + esc(r[1]) + '</a>'; }).join('') + '</div>' }) +
        closingCta();
    }
  });

  /* ------------------------------------------------------------------------
     PRICING  #/pricing
     ------------------------------------------------------------------------ */
  function faq(items) {
    return '<div class="e1s-stack" style="max-width:860px">' + items.map(function (it) {
      return '<details class="e1s-card" style="padding:0"><summary style="padding:18px 22px;cursor:pointer;font:var(--weight-semibold) var(--text-lead)/1.4 var(--font-display);list-style-position:inside">' + esc(it[0]) + '</summary><div style="padding:0 22px 20px"><p class="e1s-p">' + esc(it[1]) + '</p></div></details>';
    }).join('') + '</div>';
  }
  E1.route('/pricing', {
    title: 'Pricing', layout: 'public', keywords: 'price floor per action refusals free verifier free',
    render: function () {
      var P = D.price;
      var plan = function (key, name, gate, note) {
        var x = P[key], sov = key === 'SOV';
        return '<article class="e1s-card e1s-lvl' + (key === 'L1' ? ' e1s-card--accent' : '') + '"><div class="e1s-card__top">' + (sov ? '<span class="e1s-card__k">SOVEREIGN</span>' : c.level(key)) + prov('MODELLED') + '</div>' +
          '<h3 class="e1s-h3">' + esc(name) + '</h3>' +
          '<div><div class="e1s-stat__v" style="font-size:34px">' + inr(x.floor) + '</div><div class="e1s-stat__s">' + (sov ? 'per deployment per year' : 'platform floor per tenant per year') + ' · US$' + num(x.usd) + '</div></div>' +
          c.kv(sov ? [['Per action', '₹0.55', { mono: true }], ['Included actions', 'None — priced as a deployment']] : [['Included actions a year', num(x.incl), { mono: true }], ['Beyond the allowance', '₹' + x.rate.toFixed(2) + ' per action', { mono: true }], ['Effective at full inclusion', '₹' + x.eff.toFixed(3) + ' per action', { mono: true }]], { compact: true }) +
          '<p class="e1s-card__d" style="font-size:12px">' + esc(note) + '</p>' +
          '<div class="e1s-lvl__gate">' + ic('gate', 16) + '<span><b>Available at gate ' + esc(gate) + '.</b> ' + (key === 'L1' ? 'Today elan1 runs inside rung1 · by elan1, at rung1’s published price.' : sov ? 'No sovereign deployment is sold before the defect-propagation process exists.' : 'Frozen specification.') + '</span></div></article>';
      };
      var addons = [
        ['Regulatory pack (blended)', 'per tenant per year', inr(P.pack), 'US$1,500', 'ledger1, invoice1 or collect1 — never priced pack by pack'],
        ['Verifier profile', 'per regime per year', inr(P.profile), 'US$3,333', 'A regime’s checkable claim. Not the verifier.'],
        ['Counterparty verification seat', 'per year', inr(P.seat), 'US$500', 'Receiving-side console: register, binding, dispute log. Not the verifier.'],
        ['Evidence bundle beyond allowance', 'each', inr(P.bundle), 'US$28', 'Re-export over the same range is byte-identical except for the export time.'],
        ['Partner certification', 'per firm per year', inr(P.partner), 'US$1,667', 'Partners keep 18% of list on partner-sourced revenue.']
      ];
      var zero = [
        ['A refusal', '₹0', 'Metered at quantity zero. The database enforces it: a caller cannot forget to pass zero, because the caller does not pass it.'],
        ['The offline verifier', '₹0', 'Source, to anyone, including non-customers, for ever.'],
        ['Sandbox', '₹0', 'Metered at quantity zero, never billed.'],
        ['Platform failures and throttles', '₹0', 'Our failure is never your line item.'],
        ['Anchoring', 'Inside L2', 'Not on the meter. A customer can never buy a cheaper interval.']
      ];
      return hero({ eyebrow: 'Pricing', title: 'We bill for one thing: the governed action.',
          lead: 'One write to a system of record that was permitted, executed, recorded and billed — one row in the chain, one meter event, one invoice line, one thing an auditor can open. Refusals are free. The verifier is free.',
          actions: btn('Estimate your year', '#/pricing/calculator', 'primary', 'sliders') + btn('Book a working session', '#/demo', 'secondary'),
          aside: invoiceSnippet(),
          toc: [{ id: 'pr-plans', label: 'Levels' }, { id: 'pr-zero', label: 'What is free' }, { id: 'pr-add', label: 'Add-ons' }, { id: 'pr-rules', label: 'Rules that travel with the prices' }, { id: 'pr-anchor', label: 'Anchors' }] }) +
        '<div class="e1s-wrap" style="padding-top:24px">' + c.callout({ kind: 'caveat', title: 'Indicative pricing — modelled list prices, subject to change before general availability', body: '<p>There is no published price list yet, because there is no customer yet. The external list price per governed action is set when gate G2 passes. Prices here come from our modelled price book at ₹90 = US$1, and every figure carries ' + prov('MODELLED') + '.</p>' }) + '</div>' +
        band({ id: 'pr-plans', tone: 'paper', eyebrow: 'By assurance level', title: 'A floor, an allowance, and consumption beyond it.', lead: 'The included rate rises with the level while the overage rate falls: the floor is a right to run an evidence plane, and the overage is consumption. Levels are claims, never product tiers with brand names.',
          body: '<div class="e1s-grid e1s-grid--4">' + plan('L1', 'L1 Guarded', 'G2', 'Operators: gates, approval, rollback and a hash-chained record.') + plan('L2', 'L2 Attested', 'G4', 'Adds signing, anchoring, the bundle and profiles.') + plan('L3', 'L3 Proven', 'G6', 'Adds the second implementation, vectors, customer-held keys. No new meter.') + plan('SOV', 'Sovereign or on-premises', 'G6', 'Priced as a deployment, not a tier.') + '</div>' +
            '<p class="e1s-src">The meter basis comes from the declared blast radius — per record, per counterparty, per batch, per tenant, per crossing — and is never configurable per customer. Prices are flat to March 2029, then rise 4% a year.</p>' }) +
        band({ id: 'pr-zero', tone: 'ink', eyebrow: 'Always ₹0', title: '412 refused, ₹0.', lead: 'Every CFO asks, within about ten minutes, whether the vendor is incentivised to make the system say no. The answer is a constraint rather than a policy.',
          body: '<div class="e1s-caps">' + zero.map(function (z) { return '<div class="e1s-cap"><span>' + esc(z[0]) + '<small>' + esc(z[2]) + '</small></span><span class="e1s-stat__v" style="font-size:22px">' + esc(z[1]) + '</span></div>'; }).join('') + '</div>' }) +
        band({ id: 'pr-add', tone: 'paper', eyebrow: 'Evidence and packs', title: 'Evidence is sold on its own line.',
          body: c.table({ caption: 'Add-ons, modelled list prices', columns: [{ key: 0, label: 'Item', render: function (r) { return '<b>' + esc(r[0]) + '</b>'; } }, { key: 1, label: 'Unit' }, { key: 2, label: '₹', align: 'right', mono: true }, { key: 3, label: 'US$', align: 'right', mono: true }, { key: 4, label: 'Note' }], rows: addons }) +
            '<div style="margin-top:16px">' + note('<b>The verifier is free, to anyone.</b> A verifier profile and a counterparty seat are priced; the software that checks a bundle never is. A verifier you must buy from the vendor whose records it checks is not a verifier.', 'fingerprint') + '</div>' }) +
        band({ id: 'pr-rules', tone: 'surface', eyebrow: 'Rules that travel with the prices', title: 'Questions finance teams ask first.',
          body: faq([
            ['Can the floor be discounted?', 'No, by anybody. Overage may move up to 20% below list for 12 months or less with an end date; nobody may touch the floor, the meter basis or the price of a refusal. There is no discount on the evidence line at L2. A pilot price names the list price it is a discount from.'],
            ['Do you price per seat, or on outcomes?', 'No per-seat price and no outcome price, anywhere in the group, at any assurance level.'],
            ['How do I know an invoice line is real?', 'Every meter event carries a write id and the record’s sequence number; a line with no write id cannot be invoiced. The refusal count appears on the same table, with a control that opens the underlying records.'],
            ['What if two meters disagree?', 'The invoice goes out at the lower number and the difference is carried as a named open item. An invoice is never issued over an unreconciled period — a discrepancy stops the invoice and pages us.'],
            ['What if I dispute a line?', 'If the record supports the line, the line stands. If it does not, the line is credited in full and a defect is opened against the meter.'],
            ['Is GST included?', 'Prices are shown before GST. How GST is applied will be stated on the first invoice.'],
            ['What do I pay today?', 'Nothing to elan1 directly. In Phase 1 elan1 runs inside rung1 · by elan1, a separate venture, at ₹2,499 / 7,999 / 19,999 / 49,999+ a month by turnover band.']
          ]) }) +
        band({ id: 'pr-anchor', tone: 'paper', eyebrow: 'For comparison', title: 'A unit a hundred times rarer, and a hundred times more consequential.',
          body: '<div class="e1s-grid e1s-grid--3">' + card({ k: 'MICROSOFT AGENT 365', title: 'US$15 per user per month', body: 'Announced list price. About ₹1,350 a user a month. We never price per user or per seat.' }) +
            card({ k: 'SALESFORCE AGENTFORCE', title: 'US$0.10 per action', body: 'About ₹9.00 an action. Our top modelled rate, ₹1.60, sits well under that ceiling.' }) +
            card({ k: 'ELAN1', title: 'From ₹0.375 per governed action', body: 'Effective L1 rate at full inclusion, modelled. Refusals ₹0.' }) + '</div>' +
            '<p class="e1s-src">Competitor prices are as announced and ' + '[unverified]' + ' against contracted rates.</p>' }) +
        closingCta();
    }
  });

  /* ------------------------------------------------------------------------
     CALCULATOR  #/pricing/calculator  (state in the URL)
     ------------------------------------------------------------------------ */
  var CALC_LIMITS = { actions: [0, 20000000, 10000], refusals: [0, 2000000, 1000], packs: [0, 5, 1], profiles: [0, 5, 1], seats: [0, 100, 1], bundles: [0, 200, 1] };
  function calcRead(q) {
    var v = { level: /^(L1|L2|L3|SOV)$/.test(q.level || '') ? q.level : 'L2' };
    var def = { actions: 3000000, refusals: 146000, packs: 1, profiles: 1, seats: 0, bundles: 0 };
    Object.keys(CALC_LIMITS).forEach(function (k) {
      var n = parseInt(q[k], 10), L = CALC_LIMITS[k];
      v[k] = isNaN(n) ? def[k] : Math.max(L[0], Math.min(L[1], n));
    });
    return v;
  }
  function calcCompute(v) {
    var P = D.price, x = P[v.level];
    var over = Math.max(0, v.actions - x.incl);
    var lines = [
      [v.level === 'SOV' ? 'Sovereign deployment' : v.level + ' ' + E1.LEVELS[v.level].name + ' platform floor', v.level === 'SOV' ? 'per deployment per year' : 'per tenant per year', x.floor],
      ['Governed actions beyond the allowance', v.level === 'SOV' ? num(v.actions) + ' × ₹0.55' : num(over) + ' × ₹' + x.rate.toFixed(2) + (v.actions <= x.incl ? ' — inside the ' + num(x.incl) + ' included' : ''), v.level === 'SOV' ? v.actions * x.rate : over * x.rate],
      ['Regulatory packs', v.packs + ' × ' + inr(P.pack), v.packs * P.pack],
      ['Verifier profiles', v.profiles + ' × ' + inr(P.profile), v.profiles * P.profile],
      ['Counterparty verification seats', v.seats + ' × ' + inr(P.seat), v.seats * P.seat],
      ['Evidence bundles beyond allowance', v.bundles + ' × ' + inr(P.bundle), v.bundles * P.bundle]
    ];
    var total = lines.reduce(function (s, l) { return s + l[2]; }, 0);
    return { lines: lines, total: Math.round(total), perAction: v.actions ? total / v.actions : null };
  }
  function calcOut(v) {
    var r = calcCompute(v);
    var rows = r.lines.map(function (l) { return '<tr><th scope="row">' + esc(l[0]) + '<small>' + esc(l[1]) + '</small></th><td>' + inr(Math.round(l[2])) + '</td></tr>'; }).join('') +
      '<tr class="is-zero"><th scope="row">' + num(v.refusals) + ' refused<small>Metered at quantity zero — shown, never billed</small></th><td>₹0</td></tr>' +
      '<tr class="is-zero"><th scope="row">Offline verifier<small>Free, as source, to anyone</small></th><td>₹0</td></tr>' +
      '<tr class="is-total"><th scope="row">Total a year</th><td>' + inr(r.total) + '</td></tr>';
    return '<div class="e1s-card" style="gap:6px"><p class="e1s-eyebrow" style="margin:0">Estimated annual cost</p><div class="e1s-total" id="calc-total">' + inr(r.total) + '</div>' +
      '<p class="e1-caption e1-muted" style="margin:0">' + inr(Math.round(r.total / 12)) + ' a month · US$' + num(Math.round(r.total / 90)) + ' a year · ' + (r.perAction ? '₹' + r.perAction.toFixed(3) + ' per committed action' : 'no committed actions') + ' ' + prov('MODELLED') + '</p>' +
      '<div class="e1s-inv" style="margin-top:14px"><table><caption class="e1-sr">Estimate breakdown</caption><tbody>' + rows + '</tbody></table></div>' +
      '<div class="e1-row" style="gap:8px;margin-top:14px;flex-wrap:wrap">' + c.button('Copy link to this estimate', { icon: 'copy', attrs: 'data-action="site-calc-copy"' }) + c.button('Talk it through', { kind: 'primary', href: '#/demo?level=' + v.level + '&actions=' + v.actions, iconRight: 'arrow-right' }) + '</div></div>';
  }
  function calcQs(v) { return '?level=' + v.level + '&actions=' + v.actions + '&refusals=' + v.refusals + '&packs=' + v.packs + '&profiles=' + v.profiles + '&seats=' + v.seats + '&bundles=' + v.bundles; }
  function slider(k, label, v, help, fmtFn) {
    var L = CALC_LIMITS[k], id = 'calc-' + k;
    return '<div class="e1s-ctl"><div class="e1s-ctl__row"><label for="' + id + '">' + esc(label) + '</label><output class="e1s-ctl__val" for="' + id + '" id="' + id + '-out">' + esc(fmtFn(v[k])) + '</output></div>' +
      '<input class="e1s-range" type="range" id="' + id + '" data-calc="' + k + '" min="' + L[0] + '" max="' + L[1] + '" step="' + L[2] + '" value="' + v[k] + '" aria-describedby="' + id + '-help">' +
      '<p class="e1s-ctl__help" id="' + id + '-help">' + help + '</p></div>';
  }
  function calcState() {
    var v = { level: 'L2' };
    var on = document.querySelector('[data-action="site-calc-level"][aria-pressed="true"]'); if (on) v.level = on.getAttribute('data-value');
    Object.keys(CALC_LIMITS).forEach(function (k) { var el = document.getElementById('calc-' + k); v[k] = el ? parseInt(el.value, 10) || 0 : 0; });
    return v;
  }
  var CALC_FMT = { actions: function (n) { return num(n) + ' a year'; }, refusals: function (n) { return num(n) + ' · ₹0'; }, packs: function (n) { return String(n); }, profiles: function (n) { return String(n); }, seats: function (n) { return String(n); }, bundles: function (n) { return String(n); } };
  function calcUpdate() {
    var v = calcState();
    Object.keys(CALC_LIMITS).forEach(function (k) { var o = document.getElementById('calc-' + k + '-out'); if (o) o.textContent = CALC_FMT[k](v[k]); });
    var out = document.getElementById('calc-out'); if (out) out.innerHTML = calcOut(v);
    var inc = document.getElementById('calc-incl'); if (inc) inc.textContent = v.level === 'SOV' ? 'Sovereign has no included allowance.' : num(D.price[v.level].incl) + ' governed actions are included at ' + v.level + '.';
    document.querySelectorAll('[data-action="site-calc-preset"]').forEach(function (b) { b.setAttribute('aria-pressed', 'false'); });
    try { history.replaceState(null, '', '#/pricing/calculator' + calcQs(v)); } catch (e) { }
  }
  E1.on('input', '[data-calc]', function () { calcUpdate(); });
  E1.action('site-calc-level', function (el) {
    document.querySelectorAll('[data-action="site-calc-level"]').forEach(function (b) { b.setAttribute('aria-pressed', String(b === el)); });
    calcUpdate();
  });
  E1.action('site-calc-preset', function (el) {
    var pr = D.presets.filter(function (p) { return p.id === el.getAttribute('data-value'); })[0]; if (!pr) return;
    document.querySelectorAll('[data-action="site-calc-level"]').forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-value') === pr.level)); });
    Object.keys(CALC_LIMITS).forEach(function (k) { var i = document.getElementById('calc-' + k); if (i) i.value = pr[k]; });
    calcUpdate();
    el.setAttribute('aria-pressed', 'true');
    E1.announce(pr.label + ': ' + inr(calcCompute(calcState()).total) + ' a year');
  });
  E1.action('site-calc-copy', function () { E1.copy(location.href, 'Link to this estimate'); });

  E1.route('/pricing/calculator', {
    title: 'Price calculator', layout: 'public', crumbs: [['Pricing', '#/pricing']], keywords: 'estimate calculator annual cost',
    render: function (p, q) {
      var v = calcRead(q);
      var lv = [['L1', 'L1 Guarded'], ['L2', 'L2 Attested'], ['L3', 'L3 Proven'], ['SOV', 'Sovereign']];
      var controls = '<div class="e1s-presets" role="group" aria-label="Presets from the price book">' + D.presets.map(function (pr) { return '<button type="button" data-action="site-calc-preset" data-value="' + pr.id + '" aria-pressed="false">' + esc(pr.label) + ' · ' + esc(fmt.inrShort(pr.expect)) + '</button>'; }).join('') + '</div>' +
        '<div class="e1s-ctl"><div class="e1s-ctl__row"><span class="e1s-lbl" id="calc-level-l">Assurance level</span><span class="e1s-ctl__help" style="margin:0" id="calc-incl">' + (v.level === 'SOV' ? 'Sovereign has no included allowance.' : num(D.price[v.level].incl) + ' governed actions are included at ' + v.level + '.') + '</span></div>' +
        '<div class="e1s-presets" role="group" aria-labelledby="calc-level-l" style="margin:0">' + lv.map(function (l) { return '<button type="button" data-action="site-calc-level" data-value="' + l[0] + '" aria-pressed="' + (v.level === l[0]) + '">' + esc(l[1]) + '</button>'; }).join('') + '</div></div>' +
        slider('actions', 'Committed governed actions a year', v, 'Only committed writes are billed. Mid-market L2 tenants run about 30 lakh a year (modelled).', CALC_FMT.actions) +
        slider('refusals', 'Refused attempts a year', v, 'Shown on the invoice, on the same table — and always ₹0.', CALC_FMT.refusals) +
        slider('packs', 'Regulatory packs', v, '₹1,35,000 each a year, blended. For example ledger1.', CALC_FMT.packs) +
        slider('profiles', 'Verifier profiles', v, '₹3,00,000 per regime a year — for example in-mca-audit-trail. The verifier itself is free.', CALC_FMT.profiles) +
        slider('seats', 'Counterparty verification seats', v, '₹45,000 each a year. Receiving-side console access, not the verifier.', CALC_FMT.seats) +
        slider('bundles', 'Evidence bundles beyond the allowance', v, '₹2,500 each. The bundle allowance is not yet specified in the price book.', CALC_FMT.bundles);
      return hero({ crumbs: [['Pricing', '#/pricing']], eyebrow: 'Estimate', title: 'What would a year of governed writes cost?',
          lead: 'Move the sliders, or start from a preset in the price book. Refusals are counted and shown at ₹0. The link in your address bar always holds this estimate.' }) +
        band({ tone: 'paper', tight: true, body: '<div class="e1s-calc"><form class="e1s-card" onsubmit="return false" aria-label="Estimate inputs">' + controls + '</form>' +
          '<div class="e1s-sticky" id="calc-out" aria-live="polite">' + calcOut(v) + '</div></div>' +
          '<div style="margin-top:24px">' + c.callout({ kind: 'caveat', title: 'Modelled list prices', body: '<p>annual = floor + max(0, actions − included) × rate + packs × ₹1,35,000 + profiles × ₹3,00,000 + seats × ₹45,000 + bundles × ₹2,500. Refusals are excluded by construction. Prices are subject to change before general availability, and shown before GST.</p>' }) + '</div>' }) +
        closingCta();
    },
    mount: function () {
      var v = calcRead(E1.state.route.query || {});
      D.presets.forEach(function (pr) {
        if (pr.level === v.level && pr.actions === v.actions && pr.packs === v.packs && pr.profiles === v.profiles && pr.seats === v.seats && pr.bundles === v.bundles) {
          var b = document.querySelector('[data-action="site-calc-preset"][data-value="' + pr.id + '"]'); if (b) b.setAttribute('aria-pressed', 'true');
        }
      });
    }
  });

  /* ------------------------------------------------------------------------
     WHY ELAN1  #/why-elan1  (?show=all|doc|model|action)
     ------------------------------------------------------------------------ */
  E1.route('/why-elan1', {
    title: 'Why elan1 — the comparison', layout: 'public', keywords: 'competitors matrix comparison vendors',
    render: function (p, q) {
      var show = /^(doc|model|action)$/.test(q.show || '') ? q.show : 'all';
      var labels = { all: 'All vendors', doc: 'Documentation', model: 'Runtime, model-centric', action: 'Action-centric, one estate' };
      var rows = D.matrix.filter(function (r) { return show === 'all' || r.q === show || r.self; });
      var counts = { doc: 0, model: 0, action: 0 }; D.matrix.forEach(function (r) { if (counts[r.q] !== undefined) counts[r.q]++; });
      var filters = c.filters(['all', 'doc', 'model', 'action'].map(function (k) { return { label: labels[k], href: E1.href('/why-elan1', k === 'all' ? null : { show: k }), active: show === k, count: k === 'all' ? D.matrix.length : counts[k] }; }), { label: 'Show' });
      var matrix = '<div class="e1-table-wrap"><table class="e1-table e1s-matrix"><caption class="e1-sr">Competitive matrix v3, readings as at 20 September 2026</caption><thead><tr><th scope="col">Vendor</th><th scope="col">Object</th><th scope="col">Enforce</th><th scope="col">Per-action record</th><th scope="col">Independently checkable</th><th scope="col">Refusal is evidence</th></tr></thead><tbody>' +
        rows.map(function (r) {
          var name = r.self ? '<a href="#/roadmap"><b>' + esc(r.v) + '</b></a><br><span class="e1-caption e1-muted">Specified, not shipped</span>' : '<a href="#/reference/competitors/' + esc(r.slug) + '">' + esc(r.v) + '</a>';
          return '<tr' + (r.self ? ' class="is-self"' : '') + '><th scope="row">' + name + '</th><td>' + esc(r.obj) + '</td><td>' + ynp(r.e) + '</td><td>' + ynp(r.r) + '</td><td>' + ynp(r.i) + '</td><td>' + ynp(r.f) + '</td></tr>';
        }).join('') + '</tbody></table></div>';
      var names = function (qq) { return D.matrix.filter(function (r) { return r.q === qq; }).map(function (r) { return '<a class="e1s-tag" href="#/reference/competitors/' + r.slug + '">' + esc(r.v) + '</a>'; }).join(''); };
      var map = '<div class="e1s-map" role="img" aria-label="Market map. Documentation, model-centric: most vendors. Runtime enforcement, model-centric: agent security and gateways. Action-centric inside one estate: Palantir, ServiceNow, SAP. Action-centric, portable and checkable by a stranger: empty, including elan1’s row.">' +
        '<div class="e1s-map__q"><h3>Documentation · model-centric</h3><div class="e1s-map__names">' + names('doc') + '</div></div>' +
        '<div class="e1s-map__q"><h3>Runtime enforcement · model-centric</h3><div class="e1s-map__names">' + names('model') + '</div><p class="e1s-card__d" style="font-size:12px">The unit is a model interaction, so the record is a trace.</p></div>' +
        '<div class="e1s-map__q"><h3>On the write path · business action · one estate</h3><div class="e1s-map__names">' + names('action') + '</div><p class="e1s-card__d" style="font-size:12px">Right unit, right position in the path, locked to one estate.</p></div>' +
        '<div class="e1s-map__q e1s-map__q--empty"><h3>On the write path · business action · portable, checkable by a stranger</h3><p class="e1s-h4" style="margin-top:auto">Empty. Including our row.</p><span class="e1s-hollow"><i aria-hidden="true"></i>elan1 — specified, not shipped</span></div></div>' +
        '<div class="e1s-axis"><span>What is governed: the model → the business write</span><span>Where: documentation → the write path</span></div>';
      return hero({ eyebrow: 'Why elan1', title: 'Palantir models the world. elan1 models the permission to change it.',
          lead: 'Every other company in this market watches what an AI agent did. We compared twenty — including ourselves — on five questions. Our own row reads No today, because nothing we have built is in a customer’s production tenant.',
          actions: btn('Book a working session', '#/demo', 'primary', 'arrow-right') + btn('Competitor study', '#/reference/competitors', 'secondary'),
          toc: [{ id: 'w-map', label: 'The map' }, { id: 'w-matrix', label: 'The matrix' }, { id: 'w-wedge', label: 'Where we differ' }, { id: 'w-moat', label: 'What would close the gap' }] }) +
        band({ id: 'w-map', tone: 'paper', eyebrow: 'The tell is always the data model', title: 'Four positions. One of them is empty.', lead: 'Nobody rebuilds around a different noun after Series C. What a product treats as its central object decides what it can ever govern.', body: map }) +
        band({ id: 'w-matrix', tone: 'surface', eyebrow: 'Competitive matrix v3', title: 'Twenty vendors, five columns, one rule.',
          body: c.callout({ kind: 'rule', title: 'Designed is not yes', body: '<p>A cell reads Yes only where the capability is running in a customer’s production tenant and is publicly evidenced. Partial means it exists for a narrow slice, or exists but does not do the load-bearing part. No means it is absent, announced, on a roadmap, in a datasheet, or built but not in production. Readings are ours, from public material as at 20 September 2026, and are unverified unless marked. A finding by absence is weaker than a finding by presence.</p>' }) +
            '<div style="margin:24px 0 12px">' + filters + '</div>' + matrix +
            '<p class="e1s-src">An earlier version of this matrix scored elan1’s own per-action record as “Designed”. That was the most misleading cell in the document, and it was ours (DR-010). Each vendor links to our study of it.</p>' }) +
        band({ id: 'w-wedge', tone: 'paper', eyebrow: 'Where we differ', title: 'The industry signs what an agent was allowed to do. It does not sign what it did.',
          body: '<div class="e1s-grid e1s-grid--2">' +
            card({ icon: 'globe', title: 'Every platform governs inward', body: 'None of them governs a write into SAP, Oracle EBS, Temenos, Finacle or Tally — and none produces evidence verifiable by a party that does not trust the vendor. ServiceNow’s evidence lives in ServiceNow; Microsoft’s audit log is attested by Microsoft.' }) +
            card({ icon: 'key', title: 'Authorisation versus governance with evidence', body: 'Identity answers “may this agent call this tool”. We answer: given this payload, in this tenant, against this record, at this value, does this write need a person — and what proof exists afterward. They compose.' }) +
            card({ icon: 'gate', title: 'A kernel, not a guardian agent', body: 'A guardian agent is an agent: probabilistic, supervising another probabilistic system. A kernel is deterministic policy evaluation on the write path. Open Policy Agent signs the policy bundle; it does not sign the decision.' }) +
            card({ icon: 'scale', title: 'Palantir proves the design, not the moat', body: 'Palantir AIP is the row that proves the design is right rather than the row that proves it is ours. If someone tells you nobody is building this, they have not looked at AIP.' }) + '</div>' +
            '<div style="margin-top:16px">' + note('Across roughly 262 vendors surveyed, no funded company was found selling hash-chained, sealed, RFC 3161-anchored, offline-verifiable evidence of enforced business actions as a product. Absence of a public competitor is not proof of absence — and the receipt format is not the moat.', 'search') + '</div>' }) +
        band({ id: 'w-moat', tone: 'ink', eyebrow: 'Stated before you ask', title: 'What would close the gap.',
          body: '<div class="e1s-caps">' + [['Microsoft extends Agent 365’s audit-ready evidence to cross-platform business writes, with a verifiable receipt.', 'Watch'], ['ServiceNow gains writes or approvals into a system of record it does not own.', 'The largest single threat'], ['SAP or Oracle ships native write-path gating with signed evidence.', 'The existential scenario'], ['Any two of Microsoft, ServiceNow, SAP or Boomi make governance an included capability.', 'Watch']].map(function (x) { return '<div class="e1s-cap"><span>' + esc(x[0]) + '</span>' + status('open', x[1]) + '</div>'; }).join('') + '</div>' +
            '<p class="e1s-src">Not a trigger: funding rounds, rebrands, keynotes, roadmap slides or analyst placements.</p>' }) +
        closingCta();
    }
  });

  /* ------------------------------------------------------------------------
     SECURITY & TRUST  #/security
     ------------------------------------------------------------------------ */
  var GOLIVE = [
    'ap-south-1, three zones, no data outside India', 'Row-level security on every tenant table; cross-tenant read test green in CI', 'Credentials minted per call, ten-minute life',
    'Signing keys in managed KMS, registered with expiry (L2)', '180-day logs in India, clocks synchronised to NPL or NIC', 'A proof record for every governed write, verified on a sample',
    'One successful restore drill on record', 'DPA signed, privacy notice published, consent ledger live', 'Sub-processor list published',
    'A named CERT-In responder, and the six-hour path tested once', 'Erasure path tested end to end on a fixture tenant', 'Licence register conditional rows confirmed by counsel', 'Break-glass tested and alerting'
  ];
  E1.route('/security', {
    title: 'Security and trust', layout: 'public', keywords: 'security trust residency dpdp keys certification claims',
    render: function () {
      var retention = [['Proof records', '7 years', 'Write once, India'], ['Evidence bundles', '24 months', 'Write once — exported on request; we keep no bundles'], ['Security and access logs', 'At least 1 year', '180-day minimum in India (CERT-In)'], ['Application logs', '180 days', 'India'], ['Database snapshots', '30 days', 'Point-in-time recovery, nightly']];
      var banned = [
        ['“Tamper-proof”, “immutable”', 'We say tamper-evident: an alteration is detectable, not impossible.'],
        ['“Court-ready”, “legally admissible”', 'Only a court decides that.'],
        ['“Certified” without a date and scope', 'We hold no certification. When we do, we will say “we hold X, covering Y, issued on Z” — and nothing else.'],
        ['“Signed”, “independently verifiable” — at L1', 'L1 records are hash-chained and unsigned. At L1, verify requires us.'],
        ['“Blocked”, “prevented” — in advisory mode', 'In attested advisory mode the caller holds the credential. We say “evaluated and recorded”.'],
        ['“We cannot see customer data”', 'True only for a customer holding their own keys and salts — an L3 capability.'],
        ['“Your books are verified”', 'A PASS establishes how changes were made, not that the books are complete or the transactions genuine.'],
        ['“Regulator X has approved this”', 'No regulator has reviewed or approved elan1, and we do not say we are “in conversation” with one.']
      ];
      return hero({ eyebrow: 'Security and trust', title: 'One baseline. Fail closed. Say the limit before you are asked.',
          lead: 'One security, residency and DPDP baseline covers elan1, rung1 and stack1. This page lists what we do, what we have not yet evidenced, and what we will not claim.',
          actions: btn('Sub-processors', '#/security/subprocessors', 'secondary') + btn('Report a security issue', '#/contact?topic=security', 'secondary') + btn('Status', '#/status', 'ghost'),
          toc: [{ id: 's-res', label: 'Residency' }, { id: 's-keys', label: 'Keys and custody' }, { id: 's-ret', label: 'Retention' }, { id: 's-dpdp', label: 'DPDP' }, { id: 's-inc', label: 'Incidents' }, { id: 's-bar', label: 'The go-live bar' }, { id: 's-claims', label: 'What we claim' }] }) +
        band({ id: 's-res', tone: 'paper', eyebrow: 'Residency', title: 'Mumbai, three zones, and nothing outside India.', lead: 'Residency and key custody sit at the lowest architectural plane, which has no migration path — every choice there is permanent. There is no second region until a residency decision is written down.',
          body: '<div class="e1s-grid e1s-grid--3">' + card({ icon: 'map-pin', title: 'ap-south-1 (Mumbai)', body: 'Three availability zones. Inference runs in Mumbai. Gate G2 refuses any write whose record would leave its residency domain — and there is no override control.' }) +
            card({ icon: 'layers', title: 'Tenant isolation', body: 'Row-level security on every tenant table and a cross-tenant read test in CI. A token carries one tenant, one actor and one autonomy level.' }) +
            card({ icon: 'timer', title: 'Ten-minute credentials', body: 'The single writer receives a single-use credential scoped to one write. One write credential exists per environment; a second in the codebase fails the build.' }) + '</div>' }) +
        band({ id: 's-keys', tone: 'surface', eyebrow: 'Keys and custody', title: 'The limitation, disclosed unprompted.',
          body: '<div class="e1s-split e1s-split--wide"><div>' + c.callout({ kind: 'caveat', title: 'A sufficiently privileged insider could alter the key policy', body: '<p>At Phase 3 the signing key is held in elan1’s own cloud account under a managed KMS, and a sufficiently privileged insider in that account could alter the key policy. There is one signing key per residency domain, not per tenant: a tenant cannot prove its records were signed by a key no other tenant’s records used. Customer-held keys arrive at L3.</p>' }) + '</div>' +
            '<div class="e1s-stack">' + c.kv([['Algorithm', 'Ed25519 (L2)', { mono: true }], ['Rotation', 'Annual for signing; successor registered 30 days ahead'], ['Key register', 'ACTIVE · RETIRED · REVOKED, with dates'], ['Public keys', 'Published; fingerprints obtained out of band'], ['Break-glass', 'A declared write type with dual control; alert within 1 minute']]) + '</div></div>' }) +
        band({ id: 's-ret', tone: 'paper', eyebrow: 'Retention', title: 'Kept for as long as the obligation, and no longer.',
          body: c.table({ caption: 'Retention by class', columns: [{ key: 0, label: 'Class', render: function (r) { return '<b>' + esc(r[0]) + '</b>'; } }, { key: 1, label: 'Kept for' }, { key: 2, label: 'Where and how' }], rows: retention }) +
            '<p class="e1s-src">A backup that has never been restored is not a backup. No go-live without one successful drill on record.</p>' }) +
        band({ id: 's-dpdp', tone: 'surface', eyebrow: 'DPDP', title: 'Processor for your data. Fiduciary for our own users.',
          body: '<div class="e1s-grid e1s-grid--2">' + card({ icon: 'file-text', title: 'Data Processing Agreement first', body: 'Signed with every tenant before its first real record. The consent ledger stores purpose, time, lawful basis and notice version — not a boolean column.', foot: 'Read the DPA', href: '#/legal/dpa' }) +
            card({ icon: 'trash', title: 'Erasure within 72 hours, without breaking evidence', body: 'Erasure is an irreversible governed write with two approvers. The subject’s salt is destroyed; the chain stays intact and the verifier prints “PASS — payload unbound”. The DPDP question is open with counsel, and must be settled before the first paying tenant.', foot: 'Privacy notice', href: '#/legal/privacy' }) + '</div>' }) +
        band({ id: 's-inc', tone: 'paper', eyebrow: 'Incidents', title: 'The six-hour clock starts when we notice, not when we confirm.',
          body: '<ol class="e1s-steps" style="max-width:820px"><li><div><b>Declare</b><span>The incident is timestamped automatically; the six-hour CERT-In deadline is shown in IST.</span></div></li><li><div><b>Contain</b><span>Revoke credentials and set the tenant stop at rung 0b. Affected users see “Writes are paused for this organisation.” We verify it by attempting a write and expecting a refusal.</span></div></li><li><div><b>Report</b><span>A named responder files within six hours. If reportability is unclear, we file.</span></div></li><li><div><b>Tell you</b><span>A written update to the tenant within 72 hours; a blameless postmortem within five working days.</span></div></li></ol>' +
            '<div style="margin-top:16px">' + btn('Status and incident history', '#/status', 'secondary', 'arrow-right') + '</div>' }) +
        band({ id: 's-bar', tone: 'surface', eyebrow: 'The minimum bar', title: 'No one outside the company logs in until every row is ticked and evidenced.', lead: 'Thirteen controls, required for each brand. Today none is evidenced for an external user, because there is no external user.',
          body: '<div class="e1s-caps">' + GOLIVE.map(function (g, i) { return '<div class="e1s-cap"><span><span class="e1s-mono e1-muted">' + (i < 9 ? '0' : '') + (i + 1) + '</span> ' + esc(g) + '</span>' + status('notyet', 'Not yet evidenced') + '</div>'; }).join('') + '</div>' }) +
        band({ id: 's-claims', tone: 'paper', eyebrow: 'What we can lawfully claim', title: 'We hold no certification of any kind.', lead: 'No SOC 2, no ISO/IEC 27001, no ISO/IEC 42001, no NIST AI RMF assessment. We will certify to the standard the first paying evidence customer’s auditor names — never in parallel, and never with a logo beside an assurance-level claim.',
          body: '<div class="e1s-split"><div class="e1s-stack"><h3 class="e1s-h3">What we say today</h3>' + quote(D.l1Sentence, 'The L1 claim, verbatim', true) + '</div>' +
            '<div><h3 class="e1s-h3" style="margin-bottom:12px">Words we avoid, and why</h3>' + c.table({ caption: 'Claims we do not make', dense: true, columns: [{ key: 0, label: 'We never write' }, { key: 1, label: 'Because' }], rows: banned }) + '</div></div>' }) +
        closingCta();
    }
  });

  /* ------------------------------------------------------------------------
     SUB-PROCESSORS  #/security/subprocessors
     ------------------------------------------------------------------------ */
  E1.route('/security/subprocessors', {
    title: 'Sub-processors', layout: 'public', keywords: 'subprocessors vendors list',
    render: function (p, q) {
      return hero({ crumbs: [['Security and trust', '#/security']], eyebrow: 'Sub-processors', title: 'Everyone who can see tenant data is on this list.',
          lead: 'Name, what they process, where, under what contract, and when they were added. A component that cannot be named here does not enter the build. Tenants get notice before any addition.',
          meta: status('draft', 'Draft list — published before the first external user') + '<span>Reviewed quarterly with the licence register</span>' }) +
        band({ tone: 'paper', tight: true, body: c.table({ caption: 'Sub-processors', columns: [{ key: 0, label: 'Sub-processor', render: function (r) { return '<b>' + esc(r[0]) + '</b>'; } }, { key: 1, label: 'What they process' }, { key: 2, label: 'Region' }, { key: 3, label: 'Contract' }, { key: 4, label: 'Status', render: function (r) { return status(/Proposed/.test(r[4]) ? 'spec' : 'notbuilt', r[4]); } }, { key: 5, label: 'Note' }], rows: D.subprocessors, empty: { title: 'No sub-processors listed', why: 'The list is published before the first external user.' } }) +
          '<div class="e1s-split" style="margin-top:32px"><div>' + note('Dates added are recorded when a contract is signed. None is signed yet, so none is shown — an empty cell stays visibly empty rather than quietly filled.', 'info') + '</div>' +
          '<form class="e1s-card" data-site-form="subscribe" novalidate aria-labelledby="sub-h"><h2 class="e1s-h4" id="sub-h">Get notice before any change</h2>' + c.field('Work email', c.input({ id: 'sub-email', type: 'email', placeholder: 'dpo@yourcompany.in', describedBy: 'sub-email-msg' }), { id: 'sub-email', required: true, help: 'We write only when this list changes.' }) + c.button('Subscribe', { kind: 'primary', type: 'submit' }) + '</form></div>' }) +
        closingCta();
    }
  });

  /* ------------------------------------------------------------------------
     STANDARD  #/standard
     ------------------------------------------------------------------------ */
  E1.route('/standard', {
    title: 'Action Receipt — the standard', layout: 'public', keywords: 'action receipt standard conformance licence',
    render: function () {
      var members = [['format', 'action-receipt/1'], ['seal_suite', 'elan1-seal-v6'], ['sealed_fields', 'F01–F16'], ['digest', 'SHA-256 over the preimage'], ['signature', 'Pure Ed25519, RFC 8032 (CL-2+)'], ['key_id', 'Never the key itself'], ['anchor', 'rfc3161-6962: path, root, leaf count, token (CL-3)'], ['issuer', 'ar-org: identifier'], ['audience', 'Who it is addressed to (CL-4)'], ['nonce', 'Replay protection (CL-4)'], ['expires_at', 'Receipt expiry (CL-4)'], ['disclosure_suite · disclosures', 'elan1-sd-v1 (CL-D)'], ['limits', 'Required. What this receipt does not establish']];
      var cls = [['CL-1', 'Structural', 'L1 Guarded producers stop here: “nothing above may be claimed”.'], ['CL-2', 'Attested', 'A signature over the digest.'], ['CL-3', 'Anchored', 'An RFC 3161 anchor with an inclusion path.'], ['CL-4', 'Addressed', 'Audience, nonce and expiry.'], ['CL-D', 'Disclosing', 'Field-by-field selective disclosure.']];
      return hero({ eyebrow: 'Action Receipt', title: 'A receipt that anyone can check — in any system, ten years from now.',
          lead: 'The Action Receipt is our draft format for a receipt of one governed write. We will call it published when it is published, and open only when an organisation that is not elan1 has implemented it and passed conformance.',
          actions: btn('Report a defect', '#/contact?topic=defect', 'primary', 'arrow-right') + btn('Receipt reference', '#/developers/receipt', 'secondary') + btn('Conformance', '#/developers/conformance', 'ghost'),
          meta: status('spec', 'Draft v0.x') + '<span>Editor: elan1 · no other implementations yet</span>' }) +
        band({ tone: 'paper', eyebrow: 'Thirteen members', title: 'What a receipt carries.', lead: 'No key in the receipt. No optional field inside the sealed set — a refusal carries zeroes, not omissions. The limits line is required.',
          body: '<div class="e1s-split e1s-split--wide"><div>' + c.table({ caption: 'Receipt members', dense: true, columns: [{ key: 0, label: 'Member', mono: true }, { key: 1, label: 'Contents' }], rows: members }) + '</div>' +
            '<div class="e1s-stack">' + quote('This establishes that the issuer’s governed write path produced this record under these rules at this time. It does not establish that the underlying transaction occurred.', 'The receipt limits line', true) +
            card({ icon: 'book', title: 'Licences', bodyHtml: true, body: c.kv([['Specification', 'CC BY 4.0'], ['Reference verifier', 'Apache-2.0'], ['Vectors and tampered bundle', 'CC0'], ['The name “elan1” and marks', 'Not licensed']], { compact: true }) }) + '</div></div>' }) +
        band({ tone: 'surface', eyebrow: 'Conformance levels', title: 'Deliberately not merged with our assurance levels.', lead: 'Claims are self-asserted with a published vector run. There is no certification body or mark in v0.',
          body: '<div class="e1s-grid" style="grid-template-columns:repeat(auto-fill,minmax(200px,1fr))">' + cls.map(function (x) { return card({ k: x[0], title: x[1], body: x[2] }); }).join('') + '</div>' +
            '<p class="e1s-src">Mapping: L1 Guarded → CL-1 producer. L2 → CL-2 + CL-3. L3 → CL-2 + CL-3 + CL-4, with CL-D.</p>' }) +
        band({ tone: 'paper', eyebrow: 'Implementations', title: 'Disagreements are listed first.',
          body: c.table({ caption: 'Implementations register', columns: [{ key: 'o', label: 'Organisation' }, { key: 'r', label: 'Producer or consumer' }, { key: 'l', label: 'Levels' }, { key: 'v', label: 'Vector run' }], rows: [], empty: { title: 'No implementation by another organisation has passed the conformance suite yet', why: 'Until one does, this specification is published, not open.', fill: 'Implement from the text alone and send us your vector run. Every comment is answered.', action: { label: 'Tell us you are implementing', href: '#/contact?topic=standard' }, icon: 'code' } }) }) +
        band({ tone: 'sunken', eyebrow: 'Governance v0.x', title: 'How the draft changes, and how it leaves us.',
          body: '<div class="e1s-grid e1s-grid--3">' + card({ icon: 'message', title: '60-day comment period', body: 'Every comment is answered. Defects are classed editorial, substantive or structural and acknowledged within five working days — from anyone, with no account.' }) +
            card({ icon: 'history', title: 'Superseded, never withdrawn', body: 'A defective version is superseded with a dated note. Old receipts keep verifying under the version that produced them.' }) +
            card({ icon: 'users', title: 'Editorship moves out', body: 'Three independent implementations from at least two organisations that are not elan1 move editorship out within 12 months — to a standards body or small foundation, not yet chosen.' }) + '</div>' }) +
        closingCta();
    }
  });

  /* ------------------------------------------------------------------------
     AUDIENCE PAGES — partners, auditors, regulators, insurers
     ------------------------------------------------------------------------ */
  E1.route('/partners', {
    title: 'Partner programme', layout: 'public', keywords: 'partners ca firms implementer verifier',
    render: function () {
      var lv = [['Introducer', 'Refers and may resell. Explains the claim boundary and nothing beyond it.', 'Registered'], ['Implementer', 'Deploys packs and declarations for a client, from sandbox key to production review.', 'Certified · ₹1,50,000 a firm a year'], ['Verifier', 'Runs and explains the offline verifier for clients and their auditors.', 'Certified · ₹1,50,000 a firm a year']];
      return hero({ eyebrow: 'Partners', title: 'For CA firms, audit firms, integrators and platform OEMs.',
          lead: 'Introduce, implement or verify — without overclaiming. Partners keep 18% of list on partner-sourced revenue, shown as its own line. No partner may speak to a regulator for us.',
          actions: btn('Apply to the programme', '#/contact?topic=partner', 'primary', 'arrow-right') + btn('Partner portal', '#/partners/portal', 'secondary') }) +
        band({ tone: 'paper', eyebrow: 'Three roles', title: 'What each partner may claim.', body: '<div class="e1s-grid e1s-grid--3">' + lv.map(function (x) { return card({ k: x[2].toUpperCase(), title: x[0], body: x[1] }); }).join('') + '</div>' +
          '<div style="margin-top:16px">' + note('Partner levels are a proposal — the programme is being designed with its first firms. Whether a CA actually introduces a client is the open question we are testing.', 'info') + '</div>' }) +
        band({ tone: 'surface', eyebrow: 'Rules of the programme', title: 'The claim ladder applies to partners too.', body: list(['Partners keep 18% of list on partner-sourced revenue, shown as a contra line.', 'Certification is ₹1,50,000 per firm per year (modelled).', 'No partner or integrator may speak to a regulator on elan1’s behalf.', 'The claim-boundary test is part of certification: a partner states unprompted what a PASS does not prove.', 'No partner may raise an agent’s autonomy. Only the graduation write does that.']) }) +
        closingCta();
    }
  });

  E1.route('/auditors', {
    title: 'For auditors and CA firms', layout: 'public', keywords: 'auditors ca statutory auditor pilot verify',
    render: function () {
      return hero({ eyebrow: 'For auditors and CA firms', title: 'Check a client’s evidence without buying anything from the client’s vendor.',
          lead: 'From L2, a client hands you a bundle. You run a free verifier, on your own machine, offline, with a key fingerprint you obtained yourself. The report tells you what a PASS establishes — and, in the same breath, what it does not.',
          actions: btn('Auditor portal', '#/auditor', 'primary', 'arrow-right') + btn('Get the verifier', '#/verify', 'secondary') + btn('Join a pilot', '#/contact?topic=auditor', 'ghost') }) +
        band({ tone: 'paper', eyebrow: 'What you receive', title: 'A report in nine sections, in the same order every time.',
          body: '<div class="e1s-split"><div><ol class="e1s-steps">' + ['Verdict', 'The claim', 'Scope', 'Integrity results', 'Clause results', 'First failure, in full', 'Notes', 'Limits', 'Reproduction'].map(function (s, i) { return '<li><div><b>' + esc(s) + '</b>' + (i === 7 ? '<span>Section 8 is what makes sections 1 to 7 credible.</span>' : '') + '</div></li>'; }).join('') + '</ol></div>' +
            '<div class="e1s-stack">' + c.callout({ kind: 'rule', title: 'Three failures a verifier must never confuse', body: '<p>Integrity failure (1): the data was altered — forensics. Profile failure (2): the data is sound and a regime’s requirement is unmet — a conversation about controls. Incomplete (3): the bundle is missing a piece — ask for a complete bundle.</p>' }) +
            btn('Exit codes, in full', '#/verify/exit-codes', 'secondary', 'arrow-right') + '</div></div>' }) +
        band({ tone: 'surface', eyebrow: 'The 90-day pilot', title: 'One customer, one auditor, one period you choose.', lead: 'For ledger1 under the MCA audit-trail rule. We ask for four things from you, and a written verdict in your own words on day 80.',
          body: '<div class="e1s-grid e1s-grid--4">' + [['Run it yourself', 'The offline verifier on your own machine, air-gapped.'], ['Rely on it', 'For a working paper or a finding — or say why not.'], ['State the limits', 'Unprompted: what a PASS does not establish.'], ['Say it in writing', 'Would you ask for one again? We may keep your answer.']].map(function (x, i) { return card({ k: '0' + (i + 1), title: x[0], body: x[1] }); }).join('') + '</div>' +
            '<div style="margin-top:16px">' + note('We never describe a conversation with an auditor as validation, and we show no auditor logos or quotations.', 'info') + '</div>' }) +
        closingCta();
    }
  });

  E1.route('/regulators', {
    title: 'For regulators and supervisors', layout: 'public', keywords: 'regulators supervisors rbi mca sebi reviewer kit',
    render: function () {
      var checks = ['Obtain the verifier and check SHA256SUMS.', 'Rebuild it from source.', 'Read the source.', 'Run it air-gapped.', 'Run it on the tampered bundle and watch 1 FAIL_INTEGRITY.', 'Write your own verifier from the specification.'];
      var asks = [['Corrections to our clause bindings', 'Where our reading of a rule is wrong, we want to know.'], ['Report vocabulary', 'The words a supervisor needs a verifier report to use.'], ['A view on the open format', 'Whether a published receipt format helps an examination.'], ['A defect contact', 'Someone we tell first if a verifier release is superseded.']];
      return hero({ eyebrow: 'For regulators and supervisors', title: 'Examine without being sold to.',
          lead: 'Nothing is claimed to a regulator or a certification body that a verifier cannot demonstrate. The strongest thing you can do with our verifier is not use our software.',
          actions: btn('Reviewer view', '#/regulator', 'primary', 'arrow-right') + btn('Report a defect', '#/contact?topic=defect', 'secondary') }) +
        band({ tone: 'paper', eyebrow: 'Four asks — none of them approval', title: 'What we ask of you.', lead: 'We never ask for an endorsement, a no-objection letter, a listing, a pilot you must justify, or a waiver.',
          body: '<div class="e1s-grid e1s-grid--4">' + asks.map(function (a, i) { return card({ k: '0' + (i + 1), title: a[0], body: a[1] }); }).join('') + '</div>' }) +
        band({ tone: 'surface', eyebrow: 'Six self-checks', title: 'How a reviewer checks us without trusting us.', body: '<ol class="e1s-steps" style="max-width:760px">' + checks.map(function (x) { return '<li><div><b>' + esc(x) + '</b></div></li>'; }).join('') + '</ol>' }) +
        band({ tone: 'paper', eyebrow: 'The rule', title: 'No regulator has reviewed a verifier profile.', body: '<div class="e1s-split"><div>' + quote('Every regulator interaction is recorded as a governed write in our own operator chain.', 'Only the founder speaks for elan1, with the kernel lead for technical detail.', true) + '</div><div class="e1s-stack">' +
          c.table({ caption: 'Instruments we map to', dense: true, columns: [{ key: 0, label: 'Instrument' }, { key: 1, label: 'In force' }, { key: 2, label: 'Pack', mono: true }], rows: [['MCA Rule 3(1) and 11(g)', '1 Apr 2023', 'ledger1'], ['GST e-invoicing', '1 Aug 2023 (₹5 cr)', 'invoice1'], ['RBI FREE-AI', '13 Aug 2025', 'collect1'], ['DPDP Rules — main obligations', '13 May 2027', '—'], ['CERT-In Directions', '28 Jun 2022', '—'], ['EU AI Act, Art. 50', '2 Aug 2026', '—']] }) + '</div></div>' }) +
        closingCta();
    }
  });

  E1.route('/insurers', {
    title: 'For insurers and underwriters', layout: 'public', keywords: 'insurers underwriters ai liability',
    render: function () {
      return hero({ eyebrow: 'For insurers and underwriters', title: 'Price exposure at the interaction level, not agent-wide.',
          lead: 'Specialist AI carriers ask for trace-level evidence, meaningful human oversight, functioning kill switches and authority scoping. elan1 is designed to produce each as a record — refusals included.',
          actions: btn('Talk to us', '#/contact?topic=insurer', 'primary', 'arrow-right') + btn('The evidence', '#/evidence', 'secondary') }) +
        band({ tone: 'paper', eyebrow: 'What an underwriter asks for', title: 'Each question maps to a rung.',
          body: '<div class="e1s-grid e1s-grid--2">' +
            card({ icon: 'proof', title: 'Trace-level evidence', body: 'A sixteen-field record for every write and every refusal, hash-chained per tenant — and from L2, signed, anchored and checkable offline.' }) +
            card({ icon: 'gate', title: 'Meaningful human oversight', body: 'A named approver who has seen the diff, every gate and the policy version before pressing Approve. The approval is its own record.' }) +
            card({ icon: 'stop', title: 'A kill switch that works', body: 'Rung 0b: throwing the stop is a dual-control governed write, and it stops all writes, including refusals. Tested by attempting a write and expecting a refusal.' }) +
            card({ icon: 'sliders', title: 'Authority scoping', body: 'Autonomy A0–A5 per actor and write type, declared blast radius, and no API that sets a level. A missing grant is A0.' }) + '</div>' }) +
        band({ tone: 'surface', eyebrow: 'An underwriting profile', title: 'Structurally the same as a regulatory verifier profile.', lead: 'An insurer could bind clauses of a policy wording to checks over a bundle, exactly as ledger1 binds the MCA rule. This is a proposal; no revenue is modelled from it.',
          body: note('Insurers are the fourth party — the one who pays in cash. We are looking for one carrier to shape the profile with. We will not name a carrier until one has agreed in writing.', 'info') }) +
        closingCta();
    }
  });

  /* ------------------------------------------------------------------------
     ROADMAP  #/roadmap  — gates, not dates
     ------------------------------------------------------------------------ */
  E1.route('/roadmap', {
    title: 'Roadmap and gates', layout: 'public', keywords: 'roadmap gates g1 g6 rung ladder parked',
    render: function () {
      var gates = '<ol class="e1s-gates">' + D.roadmap.map(function (g) {
        return '<li class="e1s-gatei"><span class="e1s-gatei__id">' + esc(g.id) + '</span><div><p class="e1s-gatei__lbl">Gate</p><h3 class="e1s-h3">' + esc(g.name) + '</h3><p class="e1s-card__d" style="margin-top:6px">' + esc(g.cond) + '</p></div>' +
          '<div><p class="e1s-gatei__lbl">Releases</p><p class="e1s-card__d" style="color:var(--text-primary)">' + esc(g.releases) + '</p><p class="e1s-card__d" style="font-size:12px;margin-top:6px">Owner: ' + esc(g.owner) + '</p></div>' +
          '<div>' + status('notyet') + '</div></li>';
      }).join('') + '</ol>';
      return hero({ eyebrow: 'Roadmap', title: 'Gates, not dates.',
          lead: 'Each level and each pack arrives when an observable condition is met — a thing a stranger could watch happen. Every gate below reads “not yet attempted”, because none has been.',
          actions: btn('Decision register', '#/company/decisions', 'secondary') + btn('Changelog', '#/changelog', 'ghost'),
          meta: '<span>As at 22 September 2026</span><span>Status vocabulary: not yet attempted · attempted · passed · failed</span>' }) +
        band({ tone: 'paper', eyebrow: 'Six gates', title: 'What has to be true, in order.', lead: 'The critical path runs through key custody, two agreeing seal implementations, the timestamp-authority contract, the anchor job and the verifier, to the first India pack. The one dependency that moves everything is the timestamp-authority contract.', body: gates +
          '<p class="e1s-src">A missed gate is reported as missed, here, with the reason.</p>' }) +
        band({ tone: 'surface', eyebrow: 'The rung ladder', title: 'Five rungs of commercial proof. All open.',
          body: '<div class="e1s-grid" style="grid-template-columns:repeat(auto-fill,minmax(210px,1fr))">' + D.rungLadder.map(function (r) { return '<article class="e1s-card"><div class="e1s-card__top"><span class="e1s-card__k">' + r[0] + '</span>' + status('open') + '</div><h3 class="e1s-h4">' + esc(r[1]) + '</h3><p class="e1s-card__d">' + esc(r[2]) + '</p></article>'; }).join('') + '</div>' }) +
        band({ tone: 'paper', eyebrow: 'Parked, with the condition that reopens it', title: 'Not everything is moving.',
          body: '<div class="e1s-caps">' + [['rung1 Commerce', 'Reopens in Phase 4, after 25 paying customers (DR-008).'], ['verna1 — outbound collections voice', 'Parked (DR-007). If it reopens it is a brand, not a pack.'], ['L3 Proven engineering', 'Begins on gate G6 — an event, not a date.'], ['Sovereign deployment', 'Not sold before the defect-propagation process exists.']].map(function (x) { return '<div class="e1s-cap"><span>' + esc(x[0]) + '<small>' + esc(x[1]) + '</small></span>' + status('parked') + '</div>'; }).join('') + '</div>' }) +
        closingCta();
    }
  });

  /* ------------------------------------------------------------------------
     COMPANY, DECISIONS, ABOUT, CAREERS
     ------------------------------------------------------------------------ */
  E1.route('/company', {
    title: 'Company', layout: 'public', keywords: 'company founder perimeter rung1 stack1 team',
    render: function () {
      var brands = [
        ['elan1', 'The company, the kernel and the governed write path.', 'elan1 Private Limited · elan1.ai', 'building'],
        ['rung1 · by elan1', 'A separate venture under common founder control: governed AI agents for ERPNext, sold through CAs. The kernel’s first production consumer. Its internal use is never counted as elan1 traction.', '₹2,499 / 7,999 / 19,999 / 49,999+ a month by turnover band', 'building'],
        ['stack1', 'A separate venture: the runtime and contract layer. stack1 is the runtime, elan1 is the kernel, rung1 is the product.', 'Billed at cost + 15%', 'building'],
        ['verna1', 'Outbound collections voice.', 'Parked (DR-007)', 'parked']
      ];
      var board = [['Paying customers', '0'], ['Revenue', '₹0'], ['Cost per governed action', 'Modelled only'], ['Refusal rate', 'Not yet observable'], ['Gate outcomes', 'None attempted'], ['Certifications held', 'None']];
      return hero({ eyebrow: 'Company', title: 'The governance kernel for agentic AI.',
          lead: 'The layer that stands on the write path, refuses what it must, and produces the proof. That is the position, stated before anything else. Everything below is how we hold ourselves to it.',
          actions: btn('About us', '#/about', 'secondary') + btn('Decision register', '#/company/decisions', 'secondary') + btn('Careers', '#/careers', 'ghost') }) +
        band({ tone: 'paper', eyebrow: 'The facts', title: 'Small, in India, and pre-revenue.',
          body: '<div class="e1s-split e1s-split--wide"><div>' + c.kv([['Entity', 'elan1 Private Limited'], ['Offices', 'Coimbatore and Chennai'], ['Founder', 'M K Elango'], ['People', '11'], ['Domain', 'elan1.ai', { mono: true }], ['Customers', 'None yet — no signed order, no invoice'], ['Built on', 'Claude']], { cols: 2 }) + '</div>' +
            '<div>' + c.table({ caption: 'The board page, today', dense: true, columns: [{ key: 0, label: 'Row' }, { key: 1, label: 'Today', render: function (r) { return '<b>' + esc(r[1]) + '</b>'; } }], rows: board }) + '<p class="e1s-src">Every cell is either a measurement with a source or the words “not yet measured”.</p></div></div>' }) +
        band({ tone: 'surface', eyebrow: 'The perimeter', title: 'One kernel, and the ventures that consume it.', lead: 'Brand names are lowercase, including at the start of a sentence. Products never build their own gates, approval, proof or meter (DR-001).',
          body: '<div class="e1s-grid e1s-grid--4">' + brands.map(function (b) { return '<article class="e1s-card"><div class="e1s-card__top"><span class="e1s-card__k" style="font-size:15px">' + esc(b[0]) + '</span>' + status(b[3]) + '</div><p class="e1s-card__d">' + esc(b[1]) + '</p><p class="e1s-card__d" style="font-size:12px;margin-top:auto">' + esc(b[2]) + '</p></article>'; }).join('') + '</div>' }) +
        band({ tone: 'paper', eyebrow: 'How we run', title: 'Artefacts you can inspect, not a biography.',
          body: '<div class="e1s-grid e1s-grid--4">' + card({ k: 'DR-001–013', title: 'A numbered decision register', body: 'Thirteen closed entries, each dated and owned. Reopening one needs a new entry that supersedes it by number.', href: '#/company/decisions', foot: 'Read it' }) +
            card({ k: '15', title: 'Written kill criteria', body: 'Five per funded venture, signed by three named people before the first payment moves. Termination needs no further approval.' }) +
            card({ k: 'DR-010', title: 'Designed is not yes', body: 'Applied to our own competitive row first. It reads No in every column that matters.', href: '#/why-elan1', foot: 'See the matrix' }) +
            card({ k: '8', title: 'Ideas rejected by name', body: 'Pack candidates refused in writing against published gates — not softened, parked or renamed.', href: '#/packs', foot: 'See the refusals' }) + '</div>' }) +
        closingCta();
    }
  });

  E1.route('/company/decisions', {
    title: 'Decision register', layout: 'public', crumbs: [['Company', '#/company']], keywords: 'decision register dr adr',
    render: function () {
      return hero({ crumbs: [['Company', '#/company']], eyebrow: 'Decision register', title: 'Thirteen arguments, settled and not re-run.',
          lead: 'The register exists because the same idea once carried three names and the same name carried three ideas. An entry is closed; reopening it needs a new numbered entry that supersedes it.',
          actions: btn('Architecture decisions in the console', '#/reference/decisions', 'secondary') }) +
        band({ tone: 'paper', tight: true, body: c.table({ caption: 'Decision register DR-001 to DR-013', columns: [{ key: 0, label: 'Decision', mono: true, width: '100px' }, { key: 1, label: 'What was decided', render: function (r) { return '<b>' + esc(r[1]) + '</b>'; } }, { key: 2, label: 'What you see because of it' }, { key: 3, label: 'Status', width: '110px', render: function () { return c.badge('neutral', 'Closed', { icon: 'lock', subtle: true }); } }], rows: D.decisions }) +
          '<div class="e1s-grid e1s-grid--2" style="margin-top:24px">' + note('Document-level decisions (for example E24·D7) have no DR number yet. We cite them by document and number until they are folded into the register as DR-014 onward.', 'info') + note('Retired names never appear on screen: the scrapped ERP suite, the old platform and model names, and all-capital brand forms.', 'x') + '</div>' }) +
        closingCta();
    }
  });

  E1.route('/about', {
    title: 'About elan1', layout: 'public', keywords: 'about boilerplate pillars voice',
    render: function () {
      var voice = [['Plain', 'Short words for large ideas. If a sentence needs a second reading, rewrite it.', 'A person approves it before it happens.', 'Human-in-the-loop orchestration paradigms.'], ['Specific', 'Numbers, names and dates beat adjectives. Publish the tolerance with the value.', 'Ten apps, one control plane.', 'A comprehensive suite of solutions.'], ['Answerable', 'We name the limit and the owner. Nothing is described as automatic if a person signs it.', 'The agent drafts it. You commit it.', 'Fully autonomous, end to end.'], ['Unhurried', 'Confident without urgency. We are not selling a race; we are removing a risk.', 'Start with one process. Add the next when it holds.', 'Transform your entire enterprise today.']];
      return hero({ eyebrow: 'About', title: 'The Agentic Transformation Company.', lead: D.oneLine,
          actions: btn('Company facts', '#/company', 'secondary') + btn('Careers', '#/careers', 'ghost') }) +
        band({ tone: 'paper', eyebrow: 'In 46 words', title: 'What we do.', body: '<div class="e1s-split e1s-split--wide"><div>' + quote(D.boilerplate, 'Boilerplate, verbatim') + '</div><div class="e1s-stack">' +
          '<p class="e1s-p">The first build was an agentic ERP — ten applications, ten industry packs, a four-door interface and a declaration ontology. It was scrapped after about a hundred days. What survived was the ontology and the execution path, and they are recognisably the two things elan1 sells today.</p>' +
          '<p class="e1s-p">Then came the decision that matters most: to stop building an ERP and build only the governance layer underneath one.</p>' +
          '<p class="e1s-p">elan1 is built on Claude. A model may produce a write intent; it may never produce an allow.</p></div></div>' }) +
        band({ tone: 'surface', eyebrow: 'Three pillars, in this order', title: 'Lead with the one that answers the room’s first question.',
          body: '<ul class="e1-principles" role="list">' + D.pillars.map(function (p) { return '<li><span class="e1-principles__k">' + p[0] + '</span><span class="e1-principles__t">' + esc(p[1]) + '</span><span class="e1-principles__d">' + esc(p[2]) + '</span></li>'; }).join('') + '<li><span class="e1-principles__k">—</span><span class="e1-principles__t">Never all three as equal</span><span class="e1-principles__d">One claim per paragraph. Cut the second adjective.</span></li></ul>' }) +
        band({ tone: 'paper', eyebrow: 'Voice', title: 'Plain, specific, answerable, unhurried.',
          body: '<div class="e1s-grid e1s-grid--4">' + voice.map(function (v) { return '<article class="e1s-card"><h3 class="e1s-h3">' + esc(v[0]) + '</h3><p class="e1s-card__d">' + esc(v[1]) + '</p><p class="e1s-card__d" style="margin-top:auto"><span class="e1s-eyebrow" style="display:block;margin:0 0 4px">We say</span><b style="color:var(--text-primary)">' + esc(v[2]) + '</b></p><p class="e1s-card__d"><span class="e1s-eyebrow" style="display:block;margin:0 0 4px;color:var(--text-tertiary)">Not</span><s>' + esc(v[3]) + '</s></p></article>'; }).join('') + '</div>' }) +
        band({ tone: 'ink', eyebrow: 'The long aim', title: 'Every consequential action software takes on a business’s behalf ends in a receipt that anyone can check.',
          lead: 'In any system, ten years from now, whether or not elan1 exists. We are a long way from it, and the roadmap says how far.', actions: '<a class="e1s-btn e1s-btn--line" href="#/roadmap">Roadmap and gates ' + ic('arrow-right', 16) + '</a>' }) +
        closingCta();
    }
  });

  E1.route('/careers', {
    title: 'Careers', layout: 'public', keywords: 'jobs careers hiring roles',
    render: function () {
      return hero({ eyebrow: 'Careers', title: 'Eleven people. We hire against gates, not dates.',
          lead: 'Every role below exists because a gate on the roadmap needs it. Each says what you would own and how we would both know it worked.',
          actions: btn('Roadmap and gates', '#/roadmap', 'secondary'), meta: '<span>Coimbatore and Chennai</span><span>British English, Indian number grouping, IST</span>' }) +
        band({ tone: 'paper', tight: true, eyebrow: 'Open roles', title: D.roles.length + ' roles', body: D.roles.map(function (r) {
          return '<div class="e1s-role"><div><p class="e1s-eyebrow" style="margin:0 0 4px">' + esc(r.team) + ' · ' + esc(r.where) + '</p><h3 class="e1s-h3">' + esc(r.title) + '</h3><p class="e1s-card__d" style="margin-top:6px"><b style="color:var(--text-primary)">You would own:</b> ' + esc(r.what) + '</p><p class="e1s-card__d"><b style="color:var(--text-primary)">Done looks like:</b> ' + esc(r.done) + '</p></div>' +
            c.button('Apply', { href: '#/contact?topic=careers&role=' + r.id, iconRight: 'arrow-right' }) + '</div>';
        }).join('') }) +
        band({ tone: 'surface', eyebrow: 'How we hire', title: 'Four conversations, and a written answer.',
          body: '<ol class="e1s-steps" style="max-width:760px"><li><div><b>A 30-minute call</b><span>What you would own, and whether the gate it serves matters to you.</span></div></li><li><div><b>A working session</b><span>A real problem from our tree, with the person you would work beside.</span></div></li><li><div><b>The founder</b><span>How you decide, and what you stopped building last.</span></div></li><li><div><b>A written answer within five working days</b><span>Yes or no, with the reason.</span></div></li></ol>' }) +
        closingCta();
    }
  });

  /* ------------------------------------------------------------------------
     FORMS — contact, demo, subscribe (validated client-side)
     ------------------------------------------------------------------------ */
  function setErr(form, id, msg) {
    var ctl = form.querySelector('#' + id); if (!ctl) return;
    var m = form.querySelector('#' + id + '-msg');
    if (!m) { m = document.createElement('p'); m.id = id + '-msg'; m.className = 'e1-field__help'; var f = ctl.closest('.e1-field'); (f || ctl.parentNode).appendChild(m); ctl.setAttribute('aria-describedby', m.id); }
    if (!m.hasAttribute('data-help')) m.setAttribute('data-help', m.textContent || '');
    if (msg) { ctl.setAttribute('aria-invalid', 'true'); m.className = 'e1-field__error'; m.setAttribute('role', 'alert'); m.textContent = msg; }
    else { ctl.removeAttribute('aria-invalid'); m.className = 'e1-field__help'; m.removeAttribute('role'); m.textContent = m.getAttribute('data-help'); }
  }
  function val(form, id) { var el = form.querySelector('#' + id); if (!el) return ''; return el.type === 'checkbox' ? (el.checked ? 'yes' : '') : String(el.value || '').trim(); }
  var EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  function validate(form, rules) {
    var first = null;
    rules.forEach(function (r) {
      var v = val(form, r[0]), msg = r[1](v) || '';
      setErr(form, r[0], msg);
      if (msg && !first) first = r[0];
    });
    if (first) { var f = form.querySelector('#' + first); if (f) f.focus(); E1.announce('Please correct the highlighted fields.'); }
    return !first;
  }
  function ref(prefix) { return prefix + '-2026-' + String(Math.floor(1000 + Math.random() * 8999)); }
  E1.on('submit', 'form[data-site-form]', function (e, form) {
    e.preventDefault();
    var kind = form.getAttribute('data-site-form');
    if (kind === 'subscribe') {
      if (!validate(form, [['sub-email', function (v) { return !v ? 'Enter your work email.' : !EMAIL.test(v) ? 'That does not look like an email address.' : ''; }]])) return;
      var inModal = !!form.closest('[role="dialog"]'); form.reset(); if (inModal) E1.close();
      E1.toast(inModal ? 'We will e-mail you when an incident opens, changes or resolves.' : 'We will write to you before the list changes, and at no other time.', 'good', { title: 'Subscribed' }); return;
    }
    if (kind === 'contact') {
      var ok = validate(form, [
        ['ct-name', function (v) { return v.length < 2 ? 'Tell us your name.' : ''; }],
        ['ct-email', function (v) { return !v ? 'Enter an email address we can reply to.' : !EMAIL.test(v) ? 'That does not look like an email address.' : ''; }],
        ['ct-topic', function (v) { return !v ? 'Choose what this is about, so it reaches the right person.' : ''; }],
        ['ct-msg', function (v) { return v.length < 12 ? 'An honest question needs a sentence — at least 12 characters.' : ''; }],
        ['ct-consent', function (v) { return !v ? 'We need your agreement to store this message under our privacy notice.' : ''; }]
      ]);
      if (!ok) return;
      E1.go('/contact', { state: 'sent', topic: val(form, 'ct-topic'), ref: ref('CT') });
      return;
    }
    if (kind === 'demo') {
      var ok2 = validate(form, [
        ['dm-name', function (v) { return v.length < 2 ? 'Tell us your name.' : ''; }],
        ['dm-email', function (v) { return !v ? 'Enter your work email.' : !EMAIL.test(v) ? 'That does not look like an email address.' : /@(gmail|yahoo|hotmail|outlook)\./i.test(v) ? 'Please use your work email, so we can find your company’s tenant later.' : ''; }],
        ['dm-company', function (v) { return v.length < 2 ? 'Which company is this for?' : ''; }],
        ['dm-system', function (v) { return !v ? 'Choose your system of record.' : ''; }],
        ['dm-process', function (v) { return !v ? 'Choose the first process you would govern.' : ''; }],
        ['dm-slot', function (v) { return !v ? 'Choose a slot, in IST.' : ''; }],
        ['dm-consent', function (v) { return !v ? 'We need your agreement to store this request under our privacy notice.' : ''; }]
      ]);
      if (!ok2) return;
      E1.go('/demo', { state: 'sent', slot: val(form, 'dm-slot'), auditor: val(form, 'dm-auditor') ? 'yes' : 'no', ref: ref('WS') });
    }
  });

  var TOPICS = [['', 'Choose one'], ['session', 'A working session or pilot'], ['auditor', 'I am an auditor or CA firm'], ['regulator', 'I am a regulator or supervisor'], ['insurer', 'I am an insurer or underwriter'], ['partner', 'Partner programme'], ['security', 'Report a security issue'], ['defect', 'Report a defect in a specification or the verifier'], ['standard', 'Implementing the Action Receipt'], ['pack', 'An obligation a pack could cover'], ['careers', 'Careers'], ['press', 'Press'], ['other', 'Something else']];
  function topicLabel(k) { var t = TOPICS.filter(function (x) { return x[0] === k; })[0]; return t ? t[1] : 'your message'; }

  E1.route('/contact', {
    title: 'Contact', layout: 'public', keywords: 'contact email security defect report',
    render: function (p, q) {
      var st = q.state || '';
      var menu = statesMenu('/contact', [['', 'Form'], ['sent', 'Sent'], ['error', 'Could not send']]);
      var heroHtml = hero({ eyebrow: 'Contact', title: 'Ask us something specific.', lead: 'A person reads every message. Defect reports and regulator correspondence are acknowledged within five working days; everything else within two.', actions: menu });
      if (st === 'sent') return heroHtml + band({ tone: 'paper', narrow: true, body: '<div class="e1s-formcard e1s-stack">' + c.badge('good', 'Received') + '<h2 class="e1s-h2">Thank you. Your message is with us.</h2><p class="e1s-p">Reference <span class="e1s-code">' + esc(q.ref || 'CT-2026-4172') + '</span> · ' + esc(topicLabel(q.topic)) + '. ' + (q.topic === 'defect' || q.topic === 'regulator' ? 'We acknowledge within five working days and record the exchange as a governed write in our own operator chain.' : 'We reply within two working days, from a named person.') + '</p>' +
        '<div class="e1-row" style="gap:10px;flex-wrap:wrap">' + btn('Back to the home page', '#/', 'secondary', 'arrow-right') + btn('Send another', '#/contact', 'ghost') + '</div></div>' }) + closingCta();
      if (st === 'error') return heroHtml + band({ tone: 'paper', narrow: true, body: c.error({ title: 'We could not send your message.', body: 'The form did not reach us. Nothing was submitted, so nothing is stored.', reassurance: 'Your words are not lost if you copy them before retrying. You can also write to hello@elan1.ai.', action: { label: 'Try again', href: '#/contact' } }) }) + closingCta();
      var topic = TOPICS.some(function (t) { return t[0] === q.topic; }) ? q.topic : '';
      var pre = q.role ? 'I would like to apply for: ' + (D.roles.filter(function (r) { return r.id === q.role; })[0] || { title: q.role }).title + '.' : '';
      var form = '<form class="e1s-formcard" data-site-form="contact" novalidate aria-labelledby="ct-h"><h2 class="e1s-h3" id="ct-h" style="margin-bottom:16px">Write to us</h2><div class="e1s-form">' +
        c.field('Your name', c.input({ id: 'ct-name', describedBy: 'ct-name-msg', attrs: 'autocomplete="name"' }), { id: 'ct-name', required: true, help: 'As you would like us to address you.' }) +
        c.field('Email', c.input({ id: 'ct-email', type: 'email', describedBy: 'ct-email-msg', attrs: 'autocomplete="email"' }), { id: 'ct-email', required: true, help: 'We reply here.' }) +
        '<div class="is-full">' + c.field('What is this about?', c.select({ id: 'ct-topic', options: TOPICS.map(function (t) { return { value: t[0], label: t[1] }; }), value: topic, describedBy: 'ct-topic-msg' }), { id: 'ct-topic', required: true, help: 'Security reports go straight to the named responder.' }) + '</div>' +
        '<div class="is-full">' + c.field('Message', c.textarea({ id: 'ct-msg', rows: 6, value: pre, describedBy: 'ct-msg-msg', placeholder: 'For example: our statutory auditor wants to know how a refusal appears in the bundle.' }), { id: 'ct-msg', required: true, help: 'At least one sentence.' }) + '</div>' +
        '<div class="is-full">' + c.checkbox({ id: 'ct-consent', label: 'Store this message to reply to me, under the privacy notice.', note: 'We are the data fiduciary for this message. We keep it for 12 months.', attrs: 'aria-describedby="ct-consent-msg"' }) + '<p class="e1-field__help" id="ct-consent-msg"><a href="#/legal/privacy">Read the privacy notice</a></p></div>' +
        '<div class="e1s-form__actions">' + c.button('Send message', { kind: 'primary', type: 'submit', icon: 'send' }) + '<span class="e1-caption e1-muted">No marketing lists. No tracking cookies.</span></div></div></form>';
      var side = '<div class="e1s-stack">' + card({ icon: 'mail', title: 'General', body: 'hello@elan1.ai — a working session, a pilot, a question.' }) + card({ icon: 'lock', title: 'Security', body: 'security@elan1.ai — responsible disclosure. The six-hour clock starts when we notice.' }) + card({ icon: 'file-text', title: 'Defects in a specification or the verifier', body: 'standard@elan1.ai — from anyone, with no account. Acknowledged within five working days.' }) + card({ icon: 'building', title: 'Offices', body: 'Coimbatore and Chennai. We meet by appointment.' }) + '</div>';
      return heroHtml + band({ tone: 'paper', tight: true, body: '<div class="e1s-split e1s-split--side">' + form + side + '</div>' }) + closingCta();
    }
  });

  function slots() {
    var out = [], d = new Date(), n = 0;
    while (out.length < 6 && n < 14) {
      n++; var x = new Date(d.getTime() + n * 864e5), wd = x.getDay();
      if (wd === 0 || wd === 6) continue;
      var lbl = fmt.date(x);
      out.push({ value: lbl + ' 11:00', label: lbl + ' · 11:00–12:30 IST' });
      if (out.length < 6) out.push({ value: lbl + ' 15:30', label: lbl + ' · 15:30–17:00 IST' });
    }
    return out;
  }
  E1.route('/demo', {
    title: 'Book a working session', layout: 'public', keywords: 'demo book session pilot',
    render: function (p, q) {
      var st = q.state || '';
      var menu = statesMenu('/demo', [['', 'Form'], ['sent', 'Requested'], ['error', 'Could not send']]);
      var heroHtml = hero({ eyebrow: 'Book a working session', title: '90 minutes on one process you would let an agent touch.',
        lead: 'We work through your first process against the Right Path: which writes, which gates, who approves, what would be refused. Bring your finance lead — and, ideally, your auditor.', actions: menu,
        aside: '<ol class="e1s-steps"><li><div><b>Before</b><span>We send the sample declaration for your system of record.</span></div></li><li><div><b>During</b><span>Your first process, write by write, in a sandbox tenant. A real refusal and a real escalation.</span></div></li><li><div><b>After</b><span>A written note: what a pilot would govern, what it would not, and what it would cost at modelled list price.</span></div></li></ol>' });
      if (st === 'sent') return heroHtml + band({ tone: 'paper', narrow: true, body: '<div class="e1s-formcard e1s-stack">' + c.badge('good', 'Requested') + '<h2 class="e1s-h2">Your working session is requested.</h2>' +
        c.kv([['Reference', q.ref || 'WS-2026-3318', { mono: true }], ['Slot requested', q.slot || 'Next available'], ['Auditor named', q.auditor === 'yes' ? 'Yes — thank you' : 'Not yet']]) +
        '<p class="e1s-p">A named person confirms the slot within one working day. ' + (q.auditor === 'yes' ? '' : 'A pilot needs a named auditor, so we will ask again — it is the question that matters most.') + '</p>' +
        '<div class="e1-row" style="gap:10px;flex-wrap:wrap">' + btn('Get a sandbox key meanwhile', '#/developers/sandbox-key', 'primary', 'arrow-right') + btn('Read ledger1', '#/packs/ledger1', 'secondary') + '</div></div>' }) + closingCta();
      if (st === 'error') return heroHtml + band({ tone: 'paper', narrow: true, body: c.error({ title: 'We could not send your request.', body: 'Nothing was submitted, so nothing is stored.', reassurance: 'You can also write to hello@elan1.ai with the slot you want.', action: { label: 'Try again', href: '#/demo' } }) }) + closingCta();
      var pk = D.packs[q.pack] ? q.pack : '';
      var est = q.level && q.actions ? 'An estimate at ' + q.level + ' for ' + num(parseInt(q.actions, 10) || 0) + ' governed actions a year.' : '';
      var form = '<form class="e1s-formcard" data-site-form="demo" novalidate aria-labelledby="dm-h"><h2 class="e1s-h3" id="dm-h" style="margin-bottom:16px">Request a session</h2><div class="e1s-form">' +
        c.field('Your name', c.input({ id: 'dm-name', describedBy: 'dm-name-msg', attrs: 'autocomplete="name"' }), { id: 'dm-name', required: true, help: 'For example Venkat Raman.' }) +
        c.field('Work email', c.input({ id: 'dm-email', type: 'email', describedBy: 'dm-email-msg', attrs: 'autocomplete="email"' }), { id: 'dm-email', required: true, help: 'Your company address.' }) +
        c.field('Company', c.input({ id: 'dm-company', describedBy: 'dm-company-msg', attrs: 'autocomplete="organization"' }), { id: 'dm-company', required: true, help: 'For example Kaveri Spinning Mills Pvt Ltd.' }) +
        c.field('Annual turnover', c.select({ id: 'dm-turnover', options: [{ value: '', label: 'Choose a band' }, { value: '5-10', label: '₹5–10 crore' }, { value: '10-25', label: '₹10–25 crore' }, { value: '25-50', label: '₹25–50 crore' }, { value: '50+', label: 'Above ₹50 crore' }] }), { id: 'dm-turnover', optional: true, help: 'Sets which obligations apply.' }) +
        c.field('System of record', c.select({ id: 'dm-system', describedBy: 'dm-system-msg', options: [{ value: '', label: 'Choose one' }, { value: 'erpnext', label: 'ERPNext' }, { value: 'tally', label: 'Tally' }, { value: 'zoho', label: 'Zoho Books' }, { value: 'odoo', label: 'Odoo' }, { value: 'sap', label: 'SAP' }, { value: 'other', label: 'Something else' }] }), { id: 'dm-system', required: true, help: 'ERPNext is supported first.' }) +
        c.field('First process', c.select({ id: 'dm-process', describedBy: 'dm-process-msg', value: pk === 'collect1' ? 'collections' : pk ? 'invoices' : '', options: [{ value: '', label: 'Choose one' }, { value: 'invoices', label: 'Sales invoices' }, { value: 'payments', label: 'Payments' }, { value: 'journals', label: 'Journal entries' }, { value: 'vendors', label: 'Vendor onboarding' }, { value: 'collections', label: 'Collections' }] }), { id: 'dm-process', required: true, help: 'Start with one. Add the next when it holds.' }) +
        '<div class="is-full">' + c.field('Your statutory auditor’s name', c.input({ id: 'dm-auditor', describedBy: 'dm-auditor-msg', placeholder: 'Firm and partner, if you can' }), { id: 'dm-auditor', optional: true, help: 'We ask because a pilot needs one. We never contact them without your say-so.' }) + '</div>' +
        '<div class="is-full">' + c.field('Preferred slot', c.select({ id: 'dm-slot', describedBy: 'dm-slot-msg', options: [{ value: '', label: 'Choose a slot' }].concat(slots()) }), { id: 'dm-slot', required: true, help: 'All times IST. A named person confirms within one working day.' }) + '</div>' +
        '<div class="is-full">' + c.field('Anything we should read first', c.textarea({ id: 'dm-notes', rows: 3, value: est || (pk ? 'Interested in ' + pk + '.' : '') }), { id: 'dm-notes', optional: true, help: 'For example the approval limits you use today.' }) + '</div>' +
        '<div class="is-full">' + c.checkbox({ id: 'dm-consent', label: 'Store this request to arrange the session, under the privacy notice.', attrs: 'aria-describedby="dm-consent-msg"' }) + '<p class="e1-field__help" id="dm-consent-msg"><a href="#/legal/privacy">Read the privacy notice</a></p></div>' +
        '<div class="e1s-form__actions">' + c.button('Request the session', { kind: 'primary', type: 'submit', iconRight: 'arrow-right' }) + '<span class="e1-caption e1-muted">Or <a href="#/auth/sign-in">sign in</a> if you already have a tenant.</span></div></div></form>';
      return heroHtml + band({ tone: 'paper', tight: true, body: '<div class="e1s-split e1s-split--side">' + form + '<div class="e1s-stack">' +
        card({ icon: 'gate', title: 'What a pilot is', body: '90 days, one customer, one auditor. Refusals are part of what is being tested and should not be worked around.' }) +
        card({ icon: 'rupee', title: 'What it costs', body: 'A pilot price always names the list price it is a discount from. Refusals are ₹0.', href: '#/pricing', foot: 'Pricing' }) +
        card({ icon: 'info', title: 'Where we are', body: 'Pre-revenue. L1 Guarded is building. You would be among the first ten design partners.', href: '#/roadmap', foot: 'Roadmap' }) + '</div></div>' }) + closingCta();
    }
  });

  /* ------------------------------------------------------------------------
     GLOSSARY  #/glossary  (?q=) — searchable client-side
     ------------------------------------------------------------------------ */
  function glFilter(qv) {
    var qn = String(qv || '').toLowerCase().trim(), shown = 0;
    document.querySelectorAll('.e1s-gl__item').forEach(function (it) {
      var hit = !qn || (it.getAttribute('data-text') || '').indexOf(qn) !== -1;
      it.classList.toggle('e1s-hide', !hit); if (hit) shown++;
    });
    document.querySelectorAll('.e1s-gl__group').forEach(function (g) { g.classList.toggle('e1s-hide', !g.querySelector('.e1s-gl__item:not(.e1s-hide)')); });
    var em = document.getElementById('gl-empty'); if (em) em.classList.toggle('e1s-hide', shown > 0);
    var ct = document.getElementById('gl-count'); if (ct) ct.textContent = shown + ' of ' + D.glossary.length + ' terms';
    try { history.replaceState(null, '', '#/glossary' + (qn ? '?q=' + encodeURIComponent(qv) : '')); } catch (e) { }
  }
  E1.on('input', '#gl-q', function (e, el) { glFilter(el.value); });
  E1.route('/glossary', {
    title: 'Glossary', layout: 'public', keywords: 'glossary terms vocabulary definitions',
    render: function (p, q) {
      var terms = D.glossary.slice().sort(function (a, b) { return a[0].toLowerCase() < b[0].toLowerCase() ? -1 : 1; });
      var groups = {};
      terms.forEach(function (t) { var L = /^[a-z]/i.test(t[0]) ? t[0].charAt(0).toUpperCase() : '#'; (groups[L] = groups[L] || []).push(t); });
      var letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
      var az = '<nav class="e1s-az" aria-label="Jump to letter">' + letters.map(function (L) { return groups[L] ? '<a href="#/glossary" data-scrollto="gl-' + L + '">' + L + '</a>' : '<span aria-hidden="true">' + L + '</span>'; }).join('') + '</nav>';
      var body = Object.keys(groups).sort().map(function (L) {
        return '<section class="e1s-gl__group" aria-labelledby="gl-' + L + '"><h2 class="e1s-gl__letter" id="gl-' + L + '">' + L + '</h2><dl style="margin:0">' + groups[L].map(function (t) {
          var txt = (t[0] + ' ' + t[1] + ' ' + t[2]).toLowerCase();
          return '<div class="e1s-gl__item" data-text="' + esc(txt) + '"><dt>' + esc(t[0]) + '<small>' + esc(t[1]) + '</small></dt><dd>' + esc(t[2]) + (t[3] ? '<div class="e1s-gl__see"><a href="' + esc(t[3]) + '">See it ' + ic('arrow-right', 12) + '</a></div>' : '') + '</dd></div>';
        }).join('') + '</dl></section>';
      }).join('');
      return hero({ eyebrow: 'Glossary', title: 'Every term, defined once.', lead: 'The words the product uses exactly as written. Brand names are lowercase, including at the start of a sentence; “L” is reserved for assurance levels, “A” for autonomy.' }) +
        band({ tone: 'paper', tight: true, body: '<div class="e1s-split e1s-split--side" style="align-items:start"><div>' +
          '<div role="search">' + c.searchBox({ id: 'gl-q', value: q.q || '', placeholder: 'Search the glossary — try “refusal” or “anchor”', label: 'Search the glossary' }) + '</div>' +
          '<p class="e1-caption e1-muted" id="gl-count" aria-live="polite" style="margin-top:8px">' + D.glossary.length + ' terms</p>' + az + body +
          '<div id="gl-empty" class="e1s-hide" style="margin-top:24px">' + c.empty({ title: 'No term matches that search', why: 'The glossary holds the product’s own vocabulary. A term we do not use is not defined here.', action: [{ label: 'Clear the search', href: '#/glossary' }, { label: 'Ask us', href: '#/contact?topic=other' }], icon: 'search' }) + '</div></div>' +
          '<aside class="e1s-sticky e1s-stack">' + card({ icon: 'book', title: 'Words we keep', body: 'Governed · approve · commit · answerable · configuration · control plane · record · exception · limit · process.' }) + card({ icon: 'x', title: 'Words we do not use', body: 'The superlatives. If a sentence needs an adjective to sound important, we rewrite it with a number, a name or a date.', href: '#/about', foot: 'Our voice' }) + '</aside></div>' }) +
        closingCta();
    },
    mount: function (el, p, q) { if (q.q) glFilter(q.q); }
  });

  /* ------------------------------------------------------------------------
     LEGAL  #/legal/:doc
     ------------------------------------------------------------------------ */
  var LEGAL = {
    privacy: { title: 'Privacy notice', lead: 'For people who use this website, write to us or sign in. For these purposes elan1 is the data fiduciary.', ver: 'v0.3 draft', sections: [
      ['pv-who', 'Who we are', '<p>elan1 Private Limited, Coimbatore and Chennai, India. Grievance officer: privacy@elan1.ai. We respond within the period the DPDP Rules set.</p>'],
      ['pv-what', 'What we collect', '<ul><li><strong>Forms:</strong> your name, email, company and the message you write.</li><li><strong>Sign-in:</strong> your work email, the tenant you belong to, and sign-in times.</li><li><strong>This website:</strong> no third-party analytics and no advertising cookies. Your theme choice is kept in your own browser.</li></ul>'],
      ['pv-why', 'Why, and on what basis', '<p>To reply to you, arrange a session, or run your account. Consent is recorded with its purpose, time, lawful basis and the version of this notice — a consent ledger, not a tick box.</p>'],
      ['pv-where', 'Where it is kept', '<p>In India, in Mumbai (ap-south-1). Messages are kept for 12 months; account data for as long as your account exists, then 180 days.</p>'],
      ['pv-rights', 'Your rights', '<p>Access, correction, erasure and grievance redressal under the Digital Personal Data Protection Act 2023. Erasure is completed within 72 hours with a receipt. Where a statutory retention obligation applies, we refuse in writing, name the obligation and the date it expires.</p>'],
      ['pv-sub', 'Who else sees it', '<p>Only the sub-processors on our published list, with notice before any addition. <a href="#/security/subprocessors">See the list</a>.</p>']] },
    terms: { title: 'Terms of use', lead: 'For this website and the sandbox. Production use is governed by a signed agreement and a Data Processing Agreement.', ver: 'v0.2 draft', sections: [
      ['tm-site', 'This website', '<p>Content is provided to explain elan1. Figures marked MODELLED are forecasts, not measurements. Nothing here is an offer.</p>'],
      ['tm-sbx', 'Sandbox tenants and keys', '<p>Sandbox keys are self-serve. The sandbox chain is marked sandbox in every entry; every meter event is quantity zero and nothing is billed. Limits: 10 writes a minute, 2 concurrent. Use synthetic data only.</p>'],
      ['tm-prod', 'Production keys', '<p>Never self-serve. A production key is a credential to somebody’s books, issued only after a person reads what the applicant declared. It needs a named production owner — a person, not a distribution list.</p>'],
      ['tm-claims', 'What you may say about elan1', '<p>Describe your deployment by its assurance level and mode, in the words on our <a href="#/assurance-levels">assurance levels</a> page. Do not describe an attested advisory integration as enforced.</p>'],
      ['tm-law', 'Law', '<p>Indian law. Courts at Chennai.</p>']] },
    dpa: { title: 'Data Processing Agreement', lead: 'elan1 is the data processor for every tenant’s data. This agreement is signed before a tenant’s first real record.', ver: 'v0.4 draft template', sections: [
      ['dp-roles', 'Roles', '<p>You are the data fiduciary for your tenant’s data; elan1 is the data processor. For our own users and prospects, elan1 is the data fiduciary.</p>'],
      ['dp-res', 'Residency', '<p>Tenant data is processed and stored in India, in Mumbai, across three availability zones. No data leaves India. Gate G2 refuses any write whose record would leave its residency domain.</p>'],
      ['dp-sec', 'Security', '<p>The baseline on our <a href="#/security">security page</a>, including the thirteen-row minimum bar that must be evidenced before your first user signs in.</p>'],
      ['dp-inc', 'Incidents', '<p>CERT-In reporting within six hours of noticing. A written update to you within 72 hours, and a postmortem within five working days.</p>'],
      ['dp-erasure', 'Erasure', '<p>Within 72 hours, as a dual-control governed write. The subject’s salt is destroyed; proof records remain with identifiers erased, and verify as “PASS — payload unbound”.</p>'],
      ['dp-sub', 'Sub-processors', '<p>Listed publicly, with notice before any addition. You may object before the change takes effect.</p>']] },
    cookies: { title: 'Cookies and local storage', lead: 'This website sets no tracking or advertising cookies.', ver: 'v1.0', sections: [
      ['ck-what', 'What we store in your browser', '<ul><li><strong>Theme and density</strong> — light or dark, so the page does not flash. Local storage, never sent to us.</li><li><strong>Sign-in session</strong> — a strictly necessary cookie once you sign in to the console.</li></ul>'],
      ['ck-not', 'What we do not do', '<p>No third-party analytics, no advertising pixels, no cross-site tracking. That is why there is no cookie banner.</p>'],
      ['ck-clear', 'Clearing it', '<p>Clear this site’s data in your browser settings. The page still works; it simply forgets your theme.</p>']] }
  };
  E1.route('/legal/:doc', {
    title: function (p) { return (LEGAL[p.doc] && LEGAL[p.doc].title) || 'Legal'; }, layout: 'public', example: '/legal/privacy', keywords: 'legal privacy terms dpa cookies',
    render: function (p) {
      var d = LEGAL[p.doc];
      var others = Object.keys(LEGAL).map(function (k) { return { id: k, label: LEGAL[k].title, href: '#/legal/' + k }; });
      if (!d) return hero({ crumbs: [['Legal', '#/legal/privacy']], crumb: p.doc, eyebrow: 'Legal', title: 'No legal document called “' + p.doc + '”', lead: 'We publish four: the privacy notice, the terms of use, the Data Processing Agreement and the cookie notice.' }) +
        band({ tone: 'paper', body: c.empty({ title: 'That document does not exist', why: 'The link may be old, or mistyped.', action: others.map(function (o) { return { label: o.label, href: o.href }; }), icon: 'file-text' }) });
      return hero({ crumbs: [['Legal', '#/legal/privacy']], crumb: d.title, eyebrow: 'Legal', title: d.title, lead: d.lead,
          meta: status('draft', d.ver) + '<span>Published before the first external user · last edited 22 Sep 2026</span>',
          toc: d.sections.map(function (s) { return { id: s[0], label: s[1] }; }) }) +
        band({ tone: 'paper', tight: true, body: '<div class="e1s-split e1s-split--side"><article class="e1s-prose">' + d.sections.map(function (s) { return '<h2 id="' + s[0] + '">' + esc(s[1]) + '</h2>' + s[2]; }).join('') + '</article>' +
          '<aside class="e1s-sticky e1s-stack">' + '<nav class="e1s-card" aria-label="Legal documents" style="gap:4px"><p class="e1s-eyebrow" style="margin:0 0 6px">Legal documents</p>' + others.map(function (o) { return '<a href="' + o.href + '"' + (o.id === p.doc ? ' aria-current="page" style="font-weight:600;color:var(--text-primary)"' : '') + '>' + esc(o.label) + '</a>'; }).join('') + '</nav>' + note('These are drafts. Where a draft and a signed agreement differ, the signed agreement governs.', 'info') + '</aside></div>' });
    }
  });

  /* ------------------------------------------------------------------------
     CHANGELOG  #/changelog  (?class=additive|breaking|fix)
     ------------------------------------------------------------------------ */
  E1.route('/changelog', {
    title: 'Changelog', layout: 'public', keywords: 'changelog releases notices',
    render: function (p, q) {
      var k = /^(additive|breaking|fix)$/.test(q.class || '') ? q.class : 'all';
      var rows = D.changelog.filter(function (e) { return k === 'all' || e.cls === k; });
      var tone = { additive: 'info', breaking: 'serious', fix: 'neutral' };
      var tabs = c.tabs(['all', 'additive', 'breaking', 'fix'].map(function (x) { return { id: x, label: x === 'all' ? 'All' : x.charAt(0).toUpperCase() + x.slice(1), href: x === 'all' ? '#/changelog' : '#/changelog?class=' + x, count: x === 'all' ? D.changelog.length : D.changelog.filter(function (e) { return e.cls === x; }).length }; }), k, { label: 'Filter by class' });
      var list2 = rows.length ? c.timeline(rows.map(function (e) { return { time: e.date + ' · train ' + e.train, title: e.title, body: e.body, state: tone[e.cls], meta: c.badge(tone[e.cls], e.cls, { subtle: true }) + ' <span class="e1s-tag">' + esc(e.surface) + '</span>' }; }))
        : c.empty({ title: 'No ' + k + ' changes yet', why: 'Every change is classed additive, breaking or fix — there is no fourth class.', action: { label: 'Show all changes', href: '#/changelog' } });
      return hero({ eyebrow: 'Changelog', title: 'Every change, classed additive, breaking or fix.', lead: 'Readable without a login. Breaking changes carry dated notices: 90 days internal and 12 months external for a new KernelPort major. Deploy windows are Tuesday and Thursday, 21:00–23:00 IST.',
          actions: btn('Developer changelog', '#/developers/changelog', 'secondary') + btn('Versioning policy', '#/developers/versioning', 'ghost') }) +
        band({ tone: 'paper', tight: true, body: tabs + '<div style="margin-top:24px;max-width:860px">' + list2 + '</div>' });
    }
  });

  /* ------------------------------------------------------------------------
     DOCS  #/docs  → the developer portal
     ------------------------------------------------------------------------ */
  E1.route('/docs', {
    title: 'Docs', layout: 'public', keywords: 'docs documentation developers api',
    render: function () {
      var groups = [
        ['Start', [['Quickstart', 'A sandbox key and your first governed write.', '#/developers/quickstart'], ['Sandbox key', 'Self-serve. Quantity-zero meter.', '#/developers/sandbox-key'], ['Production request', 'Reviewed by a person, promised in two working days.', '#/developers/production-request']]],
        ['Integrate', [['KernelPort', 'Six calls, frozen.', '#/developers/kernelport'], ['MCP', '34 tools; approval as an in-band round trip.', '#/developers/mcp'], ['HTTP API', 'Eight endpoint families.', '#/developers/api'], ['TypeScript SDK', 'In-process, Enforced mode.', '#/developers/sdk/typescript'], ['Python SDK', 'In-process, Enforced mode.', '#/developers/sdk/python'], ['Webhooks', 'Signed, five-minute freshness.', '#/developers/webhooks']]],
        ['Govern', [['The Right Path', 'Ten checks and what each returns.', '#/developers/right-path'], ['Refusal register', '43 codes, one action each.', '#/developers/refusals'], ['Declarations', 'Schema, semantic rules, lint.', '#/developers/declarations'], ['Objects', 'Write intent, decision, approval, record, meter event.', '#/developers/objects']]],
        ['Prove', [['Seal v6', 'Sixteen fields, frozen.', '#/developers/seal'], ['Verifier', 'Offline, free, as source.', '#/developers/verifier'], ['Action Receipt', 'The draft standard.', '#/developers/receipt'], ['Conformance', 'C1–C14, runnable yourself.', '#/developers/conformance']]],
        ['Change', [['Versioning', 'Notice periods and the 12-month sunset.', '#/developers/versioning'], ['Changelog', 'Additive, breaking, fix.', '#/developers/changelog'], ['Architecture', 'Planes P0–P8.', '#/developers/architecture/planes']]]
      ];
      return hero({ eyebrow: 'Docs', title: 'Integrate once, against a frozen contract.', lead: 'The documentation lives in the developer portal. Sandbox keys are self-serve; production keys never are, and the gap between the two is the entire product.',
          actions: btn('Open the developer portal', '#/developers', 'primary', 'arrow-right') + btn('Quickstart', '#/developers/quickstart', 'secondary'),
          aside: c.code("curl -X POST https://sandbox.elan1.ai/v1/writes \\\n  -H 'Authorization: Bearer sk_sbx_…' \\\n  -H 'X-Kernel-Port: v1' \\\n  -d '{\"write_type\":\"erp.sales_invoice.submit\",\n       \"declaration\":\"erp.ar@7\",\n       \"idempotency_key\":\"inv-01187\"}'\n\n# 200 {\"outcome\":\"escalated\",\"seq\":4099,\n#      \"obligation\":\"OB-2026-0412\"}", 'shell', { title: 'Your first write intent' }) }) +
        groups.map(function (g, i) { return band({ tone: i % 2 ? 'surface' : 'paper', tight: true, eyebrow: g[0], title: g[0] === 'Start' ? 'Start here' : g[0], body: '<div class="e1-linkcards">' + g[1].map(function (x) { return '<a class="e1-linkcard" href="' + x[2] + '"><span class="e1-linkcard__top"><span class="e1-linkcard__t">' + esc(x[0]) + '</span>' + ic('arrow-right', 14) + '</span><span class="e1-linkcard__d">' + esc(x[1]) + '</span></a>'; }).join('') + '</div>' }); }).join('') +
        closingCta();
    }
  });

  /* ------------------------------------------------------------------------
     STATUS  #/status  (?state=degraded|outage|error|loading) and incidents
     ------------------------------------------------------------------------ */
  function uptimeBars(cmp) {
    var out = '', now = Date.now();
    for (var i = 0; i < 90; i++) {
      var ago = 89 - i, sev = cmp.incidents[ago];
      var cls = cmp.state === 'none' ? 'is-none' : sev ? 'is-' + sev : '';
      var d = fmt.date(new Date(now - ago * 864e5));
      out += '<i class="' + cls + '" title="' + esc(d + ' · ' + (cmp.state === 'none' ? 'Not in service' : sev ? ({ warning: 'Degraded', serious: 'Partial outage', critical: 'Major outage' })[sev] : 'No incident')) + '"></i>';
    }
    return '<div class="e1s-up" aria-hidden="true">' + out + '</div><div class="e1s-up__axis"><span>90 days ago</span><span>' + (cmp.uptime ? esc(cmp.uptime) + ' uptime' : 'Not in service') + '</span><span>Today</span></div>';
  }
  function compState(cmp, st) {
    if (cmp.state === 'none') return c.badge('neutral', 'Not in service · arrives at L2', { icon: 'minus' });
    if (st === 'degraded' && cmp.id === 'chain') return c.badge('serious', 'Not checked · seq 4,020–4,112');
    if (st === 'outage' && cmp.id === 'kernel') return c.badge('critical', 'Major outage');
    if (st === 'outage' && cmp.id === 'mcp') return c.badge('serious', 'Partial outage');
    return c.badge('good', 'Operational');
  }
  E1.action('site-status-sub', function () {
    E1.modal({ title: 'Subscribe to status updates', eyebrow: 'Status', body: '<form data-site-form="subscribe" novalidate><p class="e1-muted" style="margin:0 0 12px">One e-mail when an incident opens, one on each update, one when it resolves. Nothing else.</p>' + c.field('Work email', c.input({ id: 'sub-email', type: 'email', placeholder: 'ops@yourcompany.in', describedBy: 'sub-email-msg' }), { id: 'sub-email', required: true, help: 'You can unsubscribe from any e-mail.' }) + c.button('Subscribe', { kind: 'primary', type: 'submit' }) + '</form>', actions: [{ label: 'Close', kind: 'ghost' }] });
  });
  E1.route('/status', {
    title: 'Status', layout: 'public', keywords: 'status uptime incidents components',
    render: function (p, q) {
      var st = q.state || '';
      var menu = statesMenu('/status', [['', 'All operational'], ['degraded', 'Chain integrity not checked'], ['outage', 'Kernel outage'], ['loading', 'Loading'], ['error', 'Cannot load status']]);
      var top = hero({ eyebrow: 'Status', title: 'elan1 status', lead: 'Kernel, sandbox, chain integrity, meter and verifier releases — each its own component. A status page that appears the week after the first outage is read exactly as what it is.',
        actions: menu + c.button('Subscribe to updates', { icon: 'bell', size: 'lg', attrs: 'data-action="site-status-sub"' }), meta: '<span>Times in IST</span><span>Environment: sandbox and design partners · ap-south-1</span>' });
      if (st === 'loading') return top + band({ tone: 'paper', tight: true, body: c.skeleton({ kind: 'card' }) + '<div style="margin-top:16px">' + c.skeleton({ kind: 'table', rows: 6 }) + '</div>' });
      if (st === 'error') return top + band({ tone: 'paper', tight: true, body: c.error({ title: 'We cannot load live status right now.', body: 'This page could not reach the status service.', reassurance: 'This page failing says nothing about the kernel. Incidents are also posted to status subscribers by e-mail.', action: { label: 'Try again', href: '#/status' } }) });
      var sys = st === 'outage' ? '<div class="e1s-sys e1s-sys--critical" role="status">' + ic('alert', 22) + '<div>Kernel API: major outage<small>Writes are being refused as our failure (PLATFORM.POLICY_UNAVAILABLE). Nothing is allowed by default, nothing is billed, and approval expiry is paused. Updated ' + fmt.time(new Date()) + '.</small></div></div>'
        : st === 'degraded' ? '<div class="e1s-sys e1s-sys--warning" role="status">' + ic('alert', 22) + '<div>Chain integrity: not checked over seq 4,020–4,112<small>The nightly job missed its 02:10 IST window and the component flipped automatically. No break has been found; writes continue. Updated ' + fmt.time(new Date()) + '.</small></div></div>'
        : '<div class="e1s-sys" role="status">' + ic('approve', 22) + '<div>All systems operational<small>Last checked ' + fmt.dateTime(new Date()) + '. Chain integrity last read continuous at 02:10 IST.</small></div></div>';
      var comps = D.status.components.map(function (cm) {
        return '<div class="e1s-comp"><div class="e1s-comp__h"><div><div class="e1s-comp__n">' + esc(cm.name) + '</div><div class="e1s-comp__d">' + esc(cm.desc) + '</div></div>' + compState(cm, st) + '</div>' + uptimeBars(cm) + '</div>';
      }).join('');
      var inc = c.table({ caption: 'Incident history', columns: [{ key: 'id', label: 'Incident', mono: true }, { key: 'title', label: 'What happened', render: function (r) { return '<b>' + esc(r.title) + '</b><br><span class="e1-caption e1-muted">' + esc(r.comp) + '</span>'; } }, { key: 'sev', label: 'Severity', render: function (r) { return c.badge(r.sev, ({ warning: 'Degraded', serious: 'Partial outage', critical: 'Major outage' })[r.sev]); } }, { key: 'start', label: 'Started', nowrap: true }, { key: 'dur', label: 'Duration', mono: true }, { key: 'x', label: 'Status', render: function () { return c.badge('good', 'Resolved'); } }], rows: D.status.incidents, rowHref: function (r) { return '#/status/incidents/' + r.id; } });
      return top + band({ tone: 'paper', tight: true, body: sys +
          '<div style="margin-top:12px">' + c.callout({ kind: 'caveat', title: 'Prototype status page', body: '<p>This is the page we will publish from the first external user. Components and incidents here are illustrative, from the sandbox; latency is shown only once measured.</p>' }) + '</div>' +
          '<h2 class="e1s-h3" style="margin:32px 0 4px">Components</h2><p class="e1-caption e1-muted">Each bar is one day. Hover a day for its state; the word beside each component is the current state.</p>' + comps +
          '<h2 class="e1s-h3" style="margin:40px 0 12px">Incident history</h2>' + inc +
          '<p class="e1s-src">Every incident gets a written note within five working days. “Unanchored” is a stated property of a record at L1, not an outage.</p>' });
    }
  });

  E1.route('/status/incidents/:id', {
    title: function (p) { return 'Incident ' + p.id; }, layout: 'public', example: '/status/incidents/INC-2026-013', keywords: 'incident postmortem',
    render: function (p) {
      var inc = D.status.incidents.filter(function (x) { return x.id.toLowerCase() === String(p.id).toLowerCase(); })[0];
      if (!inc) return hero({ crumbs: [['Status', '#/status']], crumb: p.id, eyebrow: 'Incident', title: 'No incident ' + p.id, lead: 'Incident ids look like INC-2026-013.' }) +
        band({ tone: 'paper', body: c.empty({ title: 'We have no record of that incident', why: 'Incidents are never deleted, so this id was probably mistyped.', action: { label: 'Incident history', href: '#/status' }, icon: 'history' }) });
      var sevWord = ({ warning: 'Degraded', serious: 'Partial outage', critical: 'Major outage' })[inc.sev];
      return hero({ crumbs: [['Status', '#/status']], crumb: inc.id, eyebrow: inc.id + ' · ' + inc.comp, title: inc.title, lead: inc.summary,
          meta: c.badge(inc.sev, sevWord) + c.badge('good', 'Resolved') + '<span>' + esc(inc.start) + ' → ' + esc(inc.end) + ' · ' + esc(inc.dur) + '</span>' }) +
        band({ tone: 'paper', tight: true, body: '<div class="e1s-split e1s-split--wide"><div class="e1s-stack"><h2 class="e1s-h3">Timeline (IST)</h2>' +
          c.timeline(inc.timeline.map(function (t) { return { time: t[0], title: t[1], state: t[2] }; })) +
          '<h2 class="e1s-h3" style="margin-top:32px">Cause</h2><p class="e1s-p">' + esc(inc.cause) + '</p>' +
          '<h2 class="e1s-h3" style="margin-top:24px">What we changed</h2>' + list(inc.actions) + '</div>' +
          '<aside class="e1s-stack">' + c.card({ title: 'Impact', body: c.kv(inc.impact) }) + note('A blameless postmortem is written within five working days. Platform failures are never billed and never shown as policy refusals.', 'info') + btn('All incidents', '#/status', 'secondary', 'arrow-left') + '</aside></div>' });
    }
  });

})();
