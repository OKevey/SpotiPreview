/* SpotiPreview — editor da página de artista.
   Modo edição: SpotiPreview.html. Modo preview: mesma página clonada numa nova aba (html[data-sp-preview]). */
(() => {
  const root = document.documentElement;
  const PREVIEW = root.hasAttribute('data-sp-preview');
  const EDIT = !PREVIEW;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const el = html => { const t = document.createElement('template'); t.innerHTML = html.trim(); return t.content.firstElementChild; };
  const digits = s => parseInt(String(s).replace(/\D/g, ''), 10);
  const LOCALE = { pt: 'pt-BR', en: 'en-US', es: 'es-ES', fr: 'fr-FR', de: 'de-DE' };
  const loc = () => LOCALE[S.lang] || 'en-US';
  const full = n => n.toLocaleString(loc());
  const short = n => new Intl.NumberFormat(loc(), { notation: 'compact', maximumFractionDigits: 1 }).format(n);
  const NUM = { listeners: 1, followers: 1, rank: 1 };
  const FMT = { short, full, rank: n => '#' + n, text: v => v };
  const LOGO = { white: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDk2IiBoZWlnaHQ9IjUxMiIgdmlld0JveD0iMCAwIDQ5NiA1MTIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPgo8cGF0aCBkPSJNMjQ4IDhDMTExLjEgOCAwIDExOS4xIDAgMjU2QzAgMzkyLjkgMTExLjEgNTA0IDI0OCA1MDRDMzg0LjkgNTA0IDQ5NiAzOTIuOSA0OTYgMjU2QzQ5NiAxMTkuMSAzODQuOSA4IDI0OCA4WiIgZmlsbD0id2hpdGUiLz4KPHBhdGggZD0iTTQwMS43IDIxMi4yMDRDMzk2LjU3NyAyMTMuMDk0IDM5My4xMDkgMjExLjgyNyAzODguMDQ1IDIwOC45NjhDMzA3LjU5MyAxNjEuODMgMTc5LjY5NyAxNjkuMzc2IDEwNC4wODggMjE1LjU3OEMxMDAuNzgzIDIxNy41OSA5Ni43Mzc3IDIyMC41OTMgOTIuMDA4NSAyMjEuNDE0Qzc5LjAwMzIgMjIzLjY3MyA2Ni41NTU0IDIxMS4wMjQgNjMuMzMxNCAxOTIuNDYxQzYwLjAzNDcgMTczLjQ3OCA2Ni40NDQzIDE2MS4yOTMgNzQuNjgxMyAxNTYuMTI0QzEwNi44NjUgMTM1LjcyNSAxNDQuNDk3IDEyMi4xNDQgMTg2Ljc2NCAxMTQuODAzQzI1OC42ODcgMTAyLjMxMiAzMzcuNzQ0IDExMC40MzggNDAwLjcyMiAxNDYuMzc2QzQwOS40OTcgMTUxLjMyMiA0MTYuMDI1IDE1OS4xMDMgNDE4LjkxIDE3NS43MTNDNDIyLjIwNiAxOTQuNjk1IDQxMy43MiAyMTAuMTE2IDQwMS43IDIxMi4yMDRaTTM4OS42MjggMzIzLjg2NkMzODQuNTA1IDMyNC43NTYgMzgwLjQ5OSAzMjIuMTQ1IDM3Ni40OTIgMzIwLjEwOUMzMDUuOTQ0IDI3OS4xNTkgMjEwLjUwNyAyNzQuMzEgMTM0LjI4NCAzMTkuOUMxMjkuODcgMzIyLjUzNSAxMjcuNjIzIDMyNC43OTUgMTIzLjE4OSAzMjUuNTY1QzExMi42NDcgMzI3LjM5NiAxMDEuOTY3IDMxNi43NDEgOTkuMzcyOSAzMDEuODA2Qzk2Ljc3OTIgMjg2Ljg3MiAxMDAuMTgxIDI3Ni4wNzIgMTA5LjYyNyAyNzAuMjYyQzEzNS4xMjYgMjU0LjYxOCAxNjEuNzAxIDI0MS42NjMgMjAyLjY4OCAyMzQuNTQ1QzI2Ni42MyAyMjMuNDQgMzMyLjMwOCAyMzUuMTgzIDM4OC4xMDcgMjY3Ljc2NkMzOTcuMjUxIDI3My4wOCA0MDEuOTA2IDI4MS4xODYgNDA0LjAxNSAyOTMuMzI5QzQwNi41MzUgMzA4LjQyMSA0MDAuMzY3IDMyMi4wMDEgMzg5LjYyOCAzMjMuODY2WiIgZmlsbD0iYmxhY2siLz4KPHVzZSB4bGluazpocmVmPSIjc3Ryb2tlMF8xXzIiIGZpbGw9ImJsYWNrIi8+CjxtYXNrIGlkPSJzdHJva2UxXzFfMiIgZmlsbD0id2hpdGUiPgo8dXNlIHhsaW5rOmhyZWY9IiNzdHJva2UwXzFfMiIvPgo8L21hc2s+CjxwYXRoIGQ9Ik02My45NjAxIDE5Ni42NjVDNjMuOTYwMSAxOTYuNjY1IDc5LjEyOTggMjMxLjQxNSA4OC4wNTU4IDI1My41OUM5Ni45ODE3IDI3NS43NjUgMTAxLjY2MiAzMjAuMjQ1IDEwMS42NjIgMzIwLjI0NUwxNzYuMTA3IDI0MC40NTVDMTc2LjEwNyAyNDAuNDU1IDE1MS43MSAyNDkuMDA2IDE0NS40OTggMjI0LjkyMkMxMzkuMjg1IDIwMC44MzggMTc0Ljg5OSAxODYuNzQ1IDE3NC44OTkgMTg2Ljc0NUwxMjUuNTA3IDE5Ny40NzlMNjMuOTYwMSAxOTYuNjY1WiIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2U9ImJsYWNrIiBtYXNrPSJ1cmwoI3N0cm9rZTFfMV8yKSIvPgo8dXNlIHhsaW5rOmhyZWY9IiNzdHJva2UyXzFfMiIgZmlsbD0iYmxhY2siLz4KPG1hc2sgaWQ9InN0cm9rZTNfMV8yIiBmaWxsPSJ3aGl0ZSI+Cjx1c2UgeGxpbms6aHJlZj0iI3N0cm9rZTJfMV8yIi8+CjwvbWFzaz4KPHBhdGggZD0iTTk4LjY0NzMgMjk3LjA0NEM5OC42NDczIDI5Ny4wNDQgOTkuNTM3MiAzMzcuODk4IDEwNiAzNjAuNUMxMTIuNDYzIDM4My4xMDIgMTI5IDQxMy41IDEyOSA0MTMuNUwyMDIuNSAzNzMuNUMyMDIuNSAzNzMuNSAxOTMgMzU4LjUgMTgyLjUgMzM1LjVDMTcyIDMxMi41IDE3NS44MjEgMzAwLjE3NiAxNzUuODIxIDMwMC4xNzZMMTUwLjgxMSAzMDguMTE0TDk4LjY0NzMgMjk3LjA0NFoiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlPSJibGFjayIgbWFzaz0idXJsKCNzdHJva2UzXzFfMikiLz4KPHVzZSB4bGluazpocmVmPSIjc3Ryb2tlNF8xXzIiIGZpbGw9ImJsYWNrIi8+CjxtYXNrIGlkPSJzdHJva2U1XzFfMiIgZmlsbD0id2hpdGUiPgo8dXNlIHhsaW5rOmhyZWY9IiNzdHJva2U0XzFfMiIvPgo8L21hc2s+CjxwYXRoIGQ9Ik00MTkuNTExIDE4MC45MjhMNDE5LjI2IDE3OS45MjRMNDIwLjIwNyAxNzkuODE5TDQyMC40NjYgMTgwLjgxMUw0MTkuNTExIDE4MC45MjhaTTM1Ni4zMjYgMTk0LjA1OUwzNTUuOTk2IDE5NC45NDlMMzU0LjAzNiAxOTMuOTVMMzU1LjgwOSAxOTMuMTI4TDM1Ni4zMjYgMTk0LjA1OVpNMzU5LjExOCAyNTMuOTY0TDM1OC4zNzcgMjU0LjUxNEwzNTYuOTkyIDI1Mi43MzFMMzU5LjA3NSAyNTIuOTYxTDM1OS4xMTggMjUzLjk2NFpNNDAyLjkxIDMxMC4zNDRMNDAzLjgxNyAzMTAuODg2TDQwMy4xOTQgMzEyLjIxMkw0MDIuMTcgMzEwLjg5NEw0MDIuOTEgMzEwLjM0NFpNMzczLjcwNCAxODYuMDA4TDM3My4xODcgMTg1LjA3N0wzNzMuMzEyIDE4NS4wMkwzNzMuNDUzIDE4NS4wMDRMMzczLjcwNCAxODYuMDA4Wk0zNTkuMTE4IDI1My45NjRMMzU5Ljg1OCAyNTMuNDE1TDQwMy42NTEgMzA5Ljc5NUw0MDIuOTEgMzEwLjM0NEw0MDIuMTcgMzEwLjg5NEwzNTguMzc3IDI1NC41MTRMMzU5LjExOCAyNTMuOTY0Wk0zNTYuMzI2IDE5NC4wNTlDMzU2LjY1NiAxOTMuMTY4IDM1Ni42NTcgMTkzLjE2OSAzNTYuNjU3IDE5My4xNjlDMzU2LjY1OCAxOTMuMTY5IDM1Ni42NTggMTkzLjE3IDM1Ni42NTkgMTkzLjE3QzM1Ni42NiAxOTMuMTcxIDM1Ni42NjIgMTkzLjE3MSAzNTYuNjY0IDE5My4xNzNDMzU2LjY2OSAxOTMuMTc1IDM1Ni42NzUgMTkzLjE3OCAzNTYuNjgyIDE5My4xODJDMzU2LjY5NyAxOTMuMTg5IDM1Ni43MTkgMTkzLjIwMSAzNTYuNzQ2IDE5My4yMTVDMzU2LjgwMiAxOTMuMjQ0IDM1Ni44ODIgMTkzLjI4NyAzNTYuOTg1IDE5My4zNDNDMzU3LjE5MiAxOTMuNDU0IDM1Ny40OTEgMTkzLjYyIDM1Ny44NyAxOTMuODM4QzM1OC42MjYgMTk0LjI3NCAzNTkuNyAxOTQuOTIxIDM2MC45OCAxOTUuNzc0QzM2My41MzggMTk3LjQ3NyAzNjYuOTM3IDIwMC4wMDggMzcwLjI4NyAyMDMuMzE3QzM3Ni45ODUgMjA5LjkzMyAzODMuNTc2IDIxOS43NTcgMzgyLjY5MiAyMzIuMjlMMzgxLjcwNCAyMzIuMDY4TDM4MC43MTYgMjMxLjg0N0MzODEuNTM4IDIyMC4xOCAzNzUuNDQgMjEwLjk5OSAzNjkuMDIzIDIwNC42NjFDMzY1LjgxNSAyMDEuNDkyIDM2Mi41NDkgMTk5LjA1OCAzNjAuMDgyIDE5Ny40MTVDMzU4Ljg1IDE5Ni41OTUgMzU3LjgyMSAxOTUuOTc0IDM1Ny4xMDMgMTk1LjU2MUMzNTYuNzQ0IDE5NS4zNTQgMzU2LjQ2MyAxOTUuMTk5IDM1Ni4yNzQgMTk1LjA5N0MzNTYuMTggMTk1LjA0NSAzNTYuMTA4IDE5NS4wMDcgMzU2LjA2MSAxOTQuOTgzQzM1Ni4wMzcgMTk0Ljk3IDM1Ni4wMiAxOTQuOTYxIDM1Ni4wMDkgMTk0Ljk1NkMzNTYuMDA0IDE5NC45NTMgMzU2IDE5NC45NTEgMzU1Ljk5NyAxOTQuOTVDMzU1Ljk5NiAxOTQuOTQ5IDM1NS45OTYgMTk0Ljk0OSAzNTUuOTk1IDE5NC45NDlDMzU1Ljk5NSAxOTQuOTQ5IDM1NS45OTUgMTk0Ljk0OSAzNTUuOTk1IDE5NC45NDlDMzU1Ljk5NSAxOTQuOTQ5IDM1NS45OTYgMTk0Ljk0OSAzNTYuMzI2IDE5NC4wNTlaTTM4MS43MDQgMjMyLjA2OEwzODIuNjkyIDIzMi4yOUMzODEuODE1IDI0NC43MjcgMzc1Ljk3NyAyNTAuNDU3IDM3MC4yOCAyNTMuMDI1QzM2Ny40NTQgMjU0LjI5OSAzNjQuNjg5IDI1NC43ODQgMzYyLjYzMiAyNTQuOTUzQzM2MS42MDIgMjU1LjAzNyAzNjAuNzQ1IDI1NS4wNDIgMzYwLjE0MSAyNTUuMDI1QzM1OS44MzkgMjU1LjAxNyAzNTkuNTk5IDI1NS4wMDMgMzU5LjQzMyAyNTQuOTkxQzM1OS4zNDkgMjU0Ljk4NSAzNTkuMjg0IDI1NC45OCAzNTkuMjM4IDI1NC45NzZDMzU5LjIxNSAyNTQuOTc0IDM1OS4xOTcgMjU0Ljk3MiAzNTkuMTg0IDI1NC45NzFDMzU5LjE3NyAyNTQuOTcgMzU5LjE3MiAyNTQuOTY5IDM1OS4xNjggMjU0Ljk2OUMzNTkuMTY2IDI1NC45NjkgMzU5LjE2NCAyNTQuOTY4IDM1OS4xNjMgMjU0Ljk2OEMzNTkuMTYyIDI1NC45NjggMzU5LjE2MSAyNTQuOTY4IDM1OS4xNjEgMjU0Ljk2OEMzNTkuMTYgMjU0Ljk2OCAzNTkuMTYgMjU0Ljk2OCAzNTkuMTE4IDI1My45NjRDMzU5LjA3NSAyNTIuOTYxIDM1OS4wNzUgMjUyLjk2MSAzNTkuMDc0IDI1Mi45NjFDMzU5LjA3NCAyNTIuOTYxIDM1OS4wNzQgMjUyLjk2MSAzNTkuMDc0IDI1Mi45NjFDMzU5LjA3NCAyNTIuOTYxIDM1OS4wNzQgMjUyLjk2MSAzNTkuMDc1IDI1Mi45NjFDMzU5LjA3NiAyNTIuOTYxIDM1OS4wNzggMjUyLjk2MSAzNTkuMDgxIDI1Mi45NjFDMzU5LjA4OCAyNTIuOTYyIDM1OS4xIDI1Mi45NjMgMzU5LjExNyAyNTIuOTY1QzM1OS4xNSAyNTIuOTY4IDM1OS4yMDIgMjUyLjk3MiAzNTkuMjcyIDI1Mi45NzdDMzU5LjQxMiAyNTIuOTg3IDM1OS42MjMgMjUzIDM1OS44OTUgMjUzLjAwN0MzNjAuNDQgMjUzLjAyMiAzNjEuMjI3IDI1My4wMTggMzYyLjE4MiAyNTIuOTRDMzY0LjA5MyAyNTIuNzg0IDM2Ni42NTQgMjUyLjMzMiAzNjkuMjYxIDI1MS4xNTdDMzc0LjQzMSAyNDguODI3IDM3OS44ODYgMjQzLjYxIDM4MC43MTYgMjMxLjg0N0wzODEuNzA0IDIzMi4wNjhaTTQwMi45MSAzMTAuMzQ0QzQwMi4wMDQgMzA5LjgwMiA0MDIuMDA0IDMwOS44MDIgNDAyLjAwNSAzMDkuODAyQzQwMi4wMDUgMzA5LjgwMiA0MDIuMDA1IDMwOS44MDEgNDAyLjAwNSAzMDkuODAxQzQwMi4wMDYgMzA5Ljc5OSA0MDIuMDA3IDMwOS43OTcgNDAyLjAwOCAzMDkuNzk1QzQwMi4wMSAzMDkuNzkgNDAyLjAxNCAzMDkuNzgyIDQwMi4wMTkgMzA5Ljc3MkM0MDIuMDI4IDMwOS43NTEgNDAyLjA0MyAzMDkuNzIgNDAyLjA2MiAzMDkuNjc4QzQwMi4xMDEgMzA5LjU5NSA0MDIuMTU4IDMwOS40NzEgNDAyLjIzNCAzMDkuMzA4QzQwMi4zODQgMzA4Ljk4MiA0MDIuNjA1IDMwOC41IDQwMi44ODggMzA3Ljg3NUM0MDMuNDUzIDMwNi42MjcgNDA0LjI2MyAzMDQuODExIDQwNS4yNDIgMzAyLjU0NkM0MDcuMTk5IDI5OC4wMTUgNDA5LjgzIDI5MS42ODkgNDEyLjUyMyAyODQuNTA2QzQxNy45MTkgMjcwLjExIDQyMy41MjMgMjUyLjM4IDQyNC41MTIgMjM4Ljc3Nkw0MjUuNSAyMzlMNDI2LjQ4OCAyMzkuMjI0QzQyNS40NzcgMjUzLjEyIDQxOS43ODcgMjcxLjA2MiA0MTQuMzg4IDI4NS40NjNDNDExLjY4MyAyOTIuNjc5IDQwOS4wNDEgMjk5LjAzMiA0MDcuMDc2IDMwMy41ODJDNDA2LjA5MyAzMDUuODU3IDQwNS4yNzkgMzA3LjY4MSA0MDQuNzEgMzA4LjkzOEM0MDQuNDI2IDMwOS41NjYgNDA0LjIwMyAzMTAuMDUyIDQwNC4wNTEgMzEwLjM4MkM0MDMuOTc1IDMxMC41NDcgNDAzLjkxNiAzMTAuNjcyIDQwMy44NzcgMzEwLjc1N0M0MDMuODU3IDMxMC43OTkgNDAzLjg0MiAzMTAuODMxIDQwMy44MzIgMzEwLjg1M0M0MDMuODI3IDMxMC44NjQgNDAzLjgyMyAzMTAuODcyIDQwMy44MjEgMzEwLjg3OEM0MDMuODE5IDMxMC44OCA0MDMuODE4IDMxMC44ODIgNDAzLjgxOCAzMTAuODg0QzQwMy44MTcgMzEwLjg4NSA0MDMuODE3IDMxMC44ODUgNDAzLjgxNyAzMTAuODg1QzQwMy44MTcgMzEwLjg4NiA0MDMuODE3IDMxMC44ODYgNDAyLjkxIDMxMC4zNDRaTTQyNS41IDIzOUw0MjQuNTEyIDIzOC43NzZDNDI1LjUwNCAyMjUuMTM0IDQyNC4wMTkgMjEwLjcwMyA0MjIuMjc4IDE5OS42NjJDNDIxLjQwOCAxOTQuMTQ2IDQyMC40NzYgMTg5LjQ4NyA0MTkuNzYyIDE4Ni4yMDhDNDE5LjQwNSAxODQuNTY4IDQxOS4xMDMgMTgzLjI3NSA0MTguODkgMTgyLjM5M0M0MTguNzgzIDE4MS45NTEgNDE4LjcgMTgxLjYxMyA0MTguNjQyIDE4MS4zODZDNDE4LjYxNCAxODEuMjcyIDQxOC41OTIgMTgxLjE4NyA0MTguNTc3IDE4MS4xM0M0MTguNTcgMTgxLjEwMSA0MTguNTY0IDE4MS4wOCA0MTguNTYxIDE4MS4wNjZDNDE4LjU1OSAxODEuMDU5IDQxOC41NTggMTgxLjA1NCA0MTguNTU3IDE4MS4wNUM0MTguNTU2IDE4MS4wNDkgNDE4LjU1NiAxODEuMDQ3IDQxOC41NTYgMTgxLjA0N0M0MTguNTU2IDE4MS4wNDYgNDE4LjU1NiAxODEuMDQ2IDQxOC41NTYgMTgxLjA0NkM0MTguNTU2IDE4MS4wNDYgNDE4LjU1NiAxODEuMDQ2IDQxOS41MTEgMTgwLjkyOEM0MjAuNDY2IDE4MC44MTEgNDIwLjQ2NiAxODAuODExIDQyMC40NjYgMTgwLjgxMUM0MjAuNDY2IDE4MC44MTIgNDIwLjQ2NiAxODAuODEyIDQyMC40NjYgMTgwLjgxM0M0MjAuNDY3IDE4MC44MTQgNDIwLjQ2NyAxODAuODE1IDQyMC40NjggMTgwLjgxOEM0MjAuNDY5IDE4MC44MjIgNDIwLjQ3IDE4MC44MjggNDIwLjQ3MiAxODAuODM1QzQyMC40NzYgMTgwLjg1MSA0MjAuNDgyIDE4MC44NzQgNDIwLjQ5IDE4MC45MDRDNDIwLjUwNiAxODAuOTY1IDQyMC41MjggMTgxLjA1NCA0MjAuNTU4IDE4MS4xNzFDNDIwLjYxNyAxODEuNDA1IDQyMC43MDIgMTgxLjc1IDQyMC44MTEgMTgyLjE5OUM0MjEuMDI3IDE4My4wOTYgNDIxLjMzMyAxODQuNDA1IDQyMS42OTQgMTg2LjA2MkM0MjIuNDE1IDE4OS4zNzUgNDIzLjM1NiAxOTQuMDc3IDQyNC4yMzMgMTk5LjY0MUM0MjUuOTg3IDIxMC43NjEgNDI3LjQ5NiAyMjUuMzY2IDQyNi40ODggMjM5LjIyNEw0MjUuNSAyMzlaTTQxOS41MTEgMTgwLjkyOEw0MTkuNzYyIDE4MS45MzJMMzczLjk1NSAxODcuMDEyTDM3My43MDQgMTg2LjAwOEwzNzMuNDUzIDE4NS4wMDRMNDE5LjI2IDE3OS45MjRMNDE5LjUxMSAxODAuOTI4Wk0zNzMuNzA0IDE4Ni4wMDhMMzc0LjIyMSAxODYuOTM4TDM1Ni44NDMgMTk0Ljk4OUwzNTYuMzI2IDE5NC4wNTlMMzU1LjgwOSAxOTMuMTI4TDM3My4xODcgMTg1LjA3N0wzNzMuNzA0IDE4Ni4wMDhaIiBmaWxsPSJibGFjayIgbWFzaz0idXJsKCNzdHJva2U1XzFfMikiLz4KPHJlY3QgeD0iMTA2IiB5PSIzNzUuMzM3IiB3aWR0aD0iODMuNDQxOCIgaGVpZ2h0PSI5NSIgcng9IjQxLjcyMDkiIHRyYW5zZm9ybT0icm90YXRlKC0zMS4zOTE2IDEwNiAzNzUuMzM3KSIgZmlsbD0iYmxhY2siLz4KPGRlZnM+CjxwYXRoIGlkPSJzdHJva2UwXzFfMiIgZD0iTTYzLjk2MDEgMTk2LjY2NUwxMjUuNTA3IDE5Ny40NzlMMTc0Ljg5OSAxODYuNzQ1QzE3NC44OTkgMTg2Ljc0NSAxMzkuMjg1IDIwMC44MzggMTQ1LjQ5OCAyMjQuOTIyQzE1MS43MSAyNDkuMDA2IDE3Ni4xMDcgMjQwLjQ1NSAxNzYuMTA3IDI0MC40NTVMMTAxLjY2MiAzMjAuMjQ1QzEwMS42NjIgMzIwLjI0NSA5Ni45ODE3IDI3NS43NjUgODguMDU1OCAyNTMuNTlDNzkuMTI5OCAyMzEuNDE1IDYzLjk2MDEgMTk2LjY2NSA2My45NjAxIDE5Ni42NjVaIi8+CjxwYXRoIGlkPSJzdHJva2UyXzFfMiIgZD0iTTk4LjY0NzMgMjk3LjA0NEwxNTAuODExIDMwOC4xMTRMMTc1LjgyMSAzMDAuMTc2QzE3NS44MjEgMzAwLjE3NiAxNzIgMzEyLjUgMTgyLjUgMzM1LjVDMTkzIDM1OC41IDIwMi41IDM3My41IDIwMi41IDM3My41TDEyOSA0MTMuNUMxMjkgNDEzLjUgMTEyLjQ2MyAzODMuMTAyIDEwNiAzNjAuNUM5OS41MzcyIDMzNy44OTggOTguNjQ3MyAyOTcuMDQ0IDk4LjY0NzMgMjk3LjA0NFoiLz4KPHBhdGggaWQ9InN0cm9rZTRfMV8yIiBkPSJNNDE5LjUxMSAxODAuOTI4TDM3My43MDQgMTg2LjAwOEwzNTYuMzI2IDE5NC4wNTlDMzU2LjMyNiAxOTQuMDU5IDM4My40MSAyMDcuODY5IDM4MS43MDQgMjMyLjA2OEMzNzkuOTk3IDI1Ni4yNjggMzU5LjExOCAyNTMuOTY0IDM1OS4xMTggMjUzLjk2NEw0MDIuOTEgMzEwLjM0NEM0MDIuOTEgMzEwLjM0NCA0MjMuNSAyNjYuNSA0MjUuNSAyMzlDNDI3LjUgMjExLjUgNDE5LjUxMSAxODAuOTI4IDQxOS41MTEgMTgwLjkyOFoiLz4KPC9kZWZzPgo8L3N2Zz4K', black: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDk2IiBoZWlnaHQ9IjUxMiIgdmlld0JveD0iMCAwIDQ5NiA1MTIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPgo8cGF0aCBkPSJNMjQ4IDhDMTExLjEgOCAwIDExOS4xIDAgMjU2QzAgMzkyLjkgMTExLjEgNTA0IDI0OCA1MDRDMzg0LjkgNTA0IDQ5NiAzOTIuOSA0OTYgMjU2QzQ5NiAxMTkuMSAzODQuOSA4IDI0OCA4WiIgZmlsbD0iYmxhY2siLz4KPHVzZSB4bGluazpocmVmPSIjc3Ryb2tlMF80XzQxIiBmaWxsPSJ3aGl0ZSIvPgo8bWFzayBpZD0ic3Ryb2tlMV80XzQxIiBmaWxsPSJ3aGl0ZSI+Cjx1c2UgeGxpbms6aHJlZj0iI3N0cm9rZTBfNF80MSIvPgo8L21hc2s+CjxwYXRoIGQ9Ik00MDEuNyAyMTIuMjA0QzM5Ni41NzcgMjEzLjA5NCAzOTMuMTA5IDIxMS44MjcgMzg4LjA0NSAyMDguOTY4QzMwNy41OTMgMTYxLjgzIDE3OS42OTcgMTY5LjM3NiAxMDQuMDg4IDIxNS41NzhDMTAwLjc4MyAyMTcuNTkgOTYuNzM3NyAyMjAuNTkzIDkyLjAwODUgMjIxLjQxNEM3OS4wMDMyIDIyMy42NzMgNjYuNTU1NCAyMTEuMDI0IDYzLjMzMTQgMTkyLjQ2MUM2MC4wMzQ3IDE3My40NzggNjYuNDQ0MyAxNjEuMjkzIDc0LjY4MTMgMTU2LjEyNEMxMDYuODY1IDEzNS43MjUgMTQ0LjQ5NyAxMjIuMTQ0IDE4Ni43NjQgMTE0LjgwM0MyNTguNjg3IDEwMi4zMTIgMzM3Ljc0NCAxMTAuNDM4IDQwMC43MjIgMTQ2LjM3NkM0MDkuNDk3IDE1MS4zMjIgNDE2LjAyNSAxNTkuMTAzIDQxOC45MSAxNzUuNzEzQzQyMi4yMDYgMTk0LjY5NSA0MTMuNzIgMjEwLjExNiA0MDEuNyAyMTIuMjA0Wk0zODkuNjI4IDMyMy44NjZDMzg0LjUwNSAzMjQuNzU2IDM4MC40OTkgMzIyLjE0NSAzNzYuNDkyIDMyMC4xMDlDMzA1Ljk0NCAyNzkuMTU5IDIxMC41MDcgMjc0LjMxIDEzNC4yODQgMzE5LjlDMTI5Ljg3IDMyMi41MzUgMTI3LjYyMyAzMjQuNzk1IDEyMy4xODkgMzI1LjU2NUMxMTIuNjQ3IDMyNy4zOTYgMTAxLjk2NyAzMTYuNzQxIDk5LjM3MjkgMzAxLjgwNkM5Ni43NzkyIDI4Ni44NzEgMTAwLjE4MSAyNzYuMDcyIDEwOS42MjcgMjcwLjI2MkMxMzUuMTI2IDI1NC42MTggMTYxLjcwMSAyNDEuNjYzIDIwMi42ODggMjM0LjU0NUMyNjYuNjMgMjIzLjQ0IDMzMi4zMDggMjM1LjE4MyAzODguMTA3IDI2Ny43NjZDMzk3LjI1MSAyNzMuMDggNDAxLjkwNiAyODEuMTg2IDQwNC4wMTUgMjkzLjMyOUM0MDYuNTM1IDMwOC40MjEgNDAwLjM2NyAzMjIuMDAxIDM4OS42MjggMzIzLjg2NloiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlPSJ3aGl0ZSIgbWFzaz0idXJsKCNzdHJva2UxXzRfNDEpIi8+Cjx1c2UgeGxpbms6aHJlZj0iI3N0cm9rZTJfNF80MSIgZmlsbD0id2hpdGUiLz4KPG1hc2sgaWQ9InN0cm9rZTNfNF80MSIgZmlsbD0id2hpdGUiPgo8dXNlIHhsaW5rOmhyZWY9IiNzdHJva2UyXzRfNDEiLz4KPC9tYXNrPgo8cGF0aCBkPSJNNjMuOTYwMSAxOTYuNjY1QzYzLjk2MDEgMTk2LjY2NSA3OS4xMjk4IDIzMS40MTUgODguMDU1OCAyNTMuNTlDOTYuOTgxNyAyNzUuNzY1IDEwMS42NjIgMzIwLjI0NSAxMDEuNjYyIDMyMC4yNDVMMTc2LjEwNyAyNDAuNDU1QzE3Ni4xMDcgMjQwLjQ1NSAxNTEuNzEgMjQ5LjAwNiAxNDUuNDk4IDIyNC45MjJDMTM5LjI4NSAyMDAuODM4IDE3NC44OTkgMTg2Ljc0NSAxNzQuODk5IDE4Ni43NDVMMTI1LjUwNyAxOTcuNDc5TDYzLjk2MDEgMTk2LjY2NVoiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlPSJ3aGl0ZSIgbWFzaz0idXJsKCNzdHJva2UzXzRfNDEpIi8+Cjx1c2UgeGxpbms6aHJlZj0iI3N0cm9rZTRfNF80MSIgZmlsbD0id2hpdGUiLz4KPG1hc2sgaWQ9InN0cm9rZTVfNF80MSIgZmlsbD0id2hpdGUiPgo8dXNlIHhsaW5rOmhyZWY9IiNzdHJva2U0XzRfNDEiLz4KPC9tYXNrPgo8cGF0aCBkPSJNOTguNjQ3MyAyOTcuMDQ0Qzk4LjY0NzMgMjk3LjA0NCA5OS41MzcyIDMzNy44OTggMTA2IDM2MC41QzExMi40NjMgMzgzLjEwMiAxMjkgNDEzLjUgMTI5IDQxMy41TDIwMi41IDM3My41QzIwMi41IDM3My41IDE5MyAzNTguNSAxODIuNSAzMzUuNUMxNzIgMzEyLjUgMTc1LjgyMSAzMDAuMTc2IDE3NS44MjEgMzAwLjE3NkwxNTAuODExIDMwOC4xMTRMOTguNjQ3MyAyOTcuMDQ0WiIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2U9IndoaXRlIiBtYXNrPSJ1cmwoI3N0cm9rZTVfNF80MSkiLz4KPHVzZSB4bGluazpocmVmPSIjc3Ryb2tlNl80XzQxIiBmaWxsPSJ3aGl0ZSIvPgo8bWFzayBpZD0ic3Ryb2tlN180XzQxIiBmaWxsPSJ3aGl0ZSI+Cjx1c2UgeGxpbms6aHJlZj0iI3N0cm9rZTZfNF80MSIvPgo8L21hc2s+CjxwYXRoIGQ9Ik00MTkuNTExIDE4MC45MjhMNDE5LjI2IDE3OS45MjRMNDIwLjIwNyAxNzkuODE5TDQyMC40NjYgMTgwLjgxMUw0MTkuNTExIDE4MC45MjhaTTM1Ni4zMjYgMTk0LjA1OUwzNTUuOTk2IDE5NC45NDlMMzU0LjAzNiAxOTMuOTVMMzU1LjgwOSAxOTMuMTI4TDM1Ni4zMjYgMTk0LjA1OVpNMzU5LjExOCAyNTMuOTY0TDM1OC4zNzcgMjU0LjUxNEwzNTYuOTkyIDI1Mi43MzFMMzU5LjA3NSAyNTIuOTYxTDM1OS4xMTggMjUzLjk2NFpNNDAyLjkxIDMxMC4zNDRMNDAzLjgxNyAzMTAuODg2TDQwMy4xOTQgMzEyLjIxMkw0MDIuMTcgMzEwLjg5NEw0MDIuOTEgMzEwLjM0NFpNMzczLjcwNCAxODYuMDA4TDM3My4xODcgMTg1LjA3N0wzNzMuMzEyIDE4NS4wMkwzNzMuNDUzIDE4NS4wMDRMMzczLjcwNCAxODYuMDA4Wk0zNTkuMTE4IDI1My45NjRMMzU5Ljg1OCAyNTMuNDE1TDQwMy42NTEgMzA5Ljc5NUw0MDIuOTEgMzEwLjM0NEw0MDIuMTcgMzEwLjg5NEwzNTguMzc3IDI1NC41MTRMMzU5LjExOCAyNTMuOTY0Wk0zNTYuMzI2IDE5NC4wNTlDMzU2LjY1NiAxOTMuMTY4IDM1Ni42NTcgMTkzLjE2OSAzNTYuNjU3IDE5My4xNjlDMzU2LjY1OCAxOTMuMTY5IDM1Ni42NTggMTkzLjE3IDM1Ni42NTkgMTkzLjE3QzM1Ni42NiAxOTMuMTcxIDM1Ni42NjIgMTkzLjE3MSAzNTYuNjY0IDE5My4xNzNDMzU2LjY2OSAxOTMuMTc1IDM1Ni42NzUgMTkzLjE3OCAzNTYuNjgyIDE5My4xODJDMzU2LjY5NyAxOTMuMTg5IDM1Ni43MTkgMTkzLjIwMSAzNTYuNzQ2IDE5My4yMTVDMzU2LjgwMiAxOTMuMjQ0IDM1Ni44ODIgMTkzLjI4NyAzNTYuOTg1IDE5My4zNDNDMzU3LjE5MiAxOTMuNDU0IDM1Ny40OTEgMTkzLjYyIDM1Ny44NyAxOTMuODM4QzM1OC42MjYgMTk0LjI3NCAzNTkuNyAxOTQuOTIxIDM2MC45OCAxOTUuNzc0QzM2My41MzggMTk3LjQ3NyAzNjYuOTM3IDIwMC4wMDggMzcwLjI4NyAyMDMuMzE3QzM3Ni45ODUgMjA5LjkzMyAzODMuNTc2IDIxOS43NTcgMzgyLjY5MiAyMzIuMjlMMzgxLjcwNCAyMzIuMDY4TDM4MC43MTYgMjMxLjg0N0MzODEuNTM4IDIyMC4xOCAzNzUuNDQgMjEwLjk5OSAzNjkuMDIzIDIwNC42NjFDMzY1LjgxNSAyMDEuNDkyIDM2Mi41NDkgMTk5LjA1OCAzNjAuMDgyIDE5Ny40MTVDMzU4Ljg1IDE5Ni41OTUgMzU3LjgyMSAxOTUuOTc0IDM1Ny4xMDMgMTk1LjU2MUMzNTYuNzQ0IDE5NS4zNTQgMzU2LjQ2MyAxOTUuMTk5IDM1Ni4yNzQgMTk1LjA5N0MzNTYuMTggMTk1LjA0NSAzNTYuMTA4IDE5NS4wMDcgMzU2LjA2MSAxOTQuOTgzQzM1Ni4wMzcgMTk0Ljk3IDM1Ni4wMiAxOTQuOTYxIDM1Ni4wMDkgMTk0Ljk1NkMzNTYuMDA0IDE5NC45NTMgMzU2IDE5NC45NTEgMzU1Ljk5NyAxOTQuOTVDMzU1Ljk5NiAxOTQuOTQ5IDM1NS45OTYgMTk0Ljk0OSAzNTUuOTk1IDE5NC45NDlDMzU1Ljk5NSAxOTQuOTQ5IDM1NS45OTUgMTk0Ljk0OSAzNTUuOTk1IDE5NC45NDlDMzU1Ljk5NSAxOTQuOTQ5IDM1NS45OTYgMTk0Ljk0OSAzNTYuMzI2IDE5NC4wNTlaTTM4MS43MDQgMjMyLjA2OEwzODIuNjkyIDIzMi4yOUMzODEuODE1IDI0NC43MjcgMzc1Ljk3NyAyNTAuNDU3IDM3MC4yOCAyNTMuMDI1QzM2Ny40NTQgMjU0LjI5OSAzNjQuNjg5IDI1NC43ODQgMzYyLjYzMiAyNTQuOTUzQzM2MS42MDIgMjU1LjAzNyAzNjAuNzQ1IDI1NS4wNDIgMzYwLjE0MSAyNTUuMDI1QzM1OS44MzkgMjU1LjAxNyAzNTkuNTk5IDI1NS4wMDMgMzU5LjQzMyAyNTQuOTkxQzM1OS4zNDkgMjU0Ljk4NSAzNTkuMjg0IDI1NC45OCAzNTkuMjM4IDI1NC45NzZDMzU5LjIxNSAyNTQuOTc0IDM1OS4xOTcgMjU0Ljk3MiAzNTkuMTg0IDI1NC45NzFDMzU5LjE3NyAyNTQuOTcgMzU5LjE3MiAyNTQuOTY5IDM1OS4xNjggMjU0Ljk2OUMzNTkuMTY2IDI1NC45NjkgMzU5LjE2NCAyNTQuOTY4IDM1OS4xNjMgMjU0Ljk2OEMzNTkuMTYyIDI1NC45NjggMzU5LjE2MSAyNTQuOTY4IDM1OS4xNjEgMjU0Ljk2OEMzNTkuMTYgMjU0Ljk2OCAzNTkuMTYgMjU0Ljk2OCAzNTkuMTE4IDI1My45NjRDMzU5LjA3NSAyNTIuOTYxIDM1OS4wNzUgMjUyLjk2MSAzNTkuMDc0IDI1Mi45NjFDMzU5LjA3NCAyNTIuOTYxIDM1OS4wNzQgMjUyLjk2MSAzNTkuMDc0IDI1Mi45NjFDMzU5LjA3NCAyNTIuOTYxIDM1OS4wNzQgMjUyLjk2MSAzNTkuMDc1IDI1Mi45NjFDMzU5LjA3NiAyNTIuOTYxIDM1OS4wNzggMjUyLjk2MSAzNTkuMDgxIDI1Mi45NjFDMzU5LjA4OCAyNTIuOTYyIDM1OS4xIDI1Mi45NjMgMzU5LjExNyAyNTIuOTY1QzM1OS4xNSAyNTIuOTY4IDM1OS4yMDIgMjUyLjk3MiAzNTkuMjcyIDI1Mi45NzdDMzU5LjQxMiAyNTIuOTg3IDM1OS42MjMgMjUzIDM1OS44OTUgMjUzLjAwN0MzNjAuNDQgMjUzLjAyMiAzNjEuMjI3IDI1My4wMTggMzYyLjE4MiAyNTIuOTRDMzY0LjA5MyAyNTIuNzg0IDM2Ni42NTQgMjUyLjMzMiAzNjkuMjYxIDI1MS4xNTdDMzc0LjQzMSAyNDguODI3IDM3OS44ODYgMjQzLjYxIDM4MC43MTYgMjMxLjg0N0wzODEuNzA0IDIzMi4wNjhaTTQwMi45MSAzMTAuMzQ0QzQwMi4wMDQgMzA5LjgwMiA0MDIuMDA0IDMwOS44MDIgNDAyLjAwNSAzMDkuODAyQzQwMi4wMDUgMzA5LjgwMiA0MDIuMDA1IDMwOS44MDEgNDAyLjAwNSAzMDkuODAxQzQwMi4wMDYgMzA5Ljc5OSA0MDIuMDA3IDMwOS43OTcgNDAyLjAwOCAzMDkuNzk1QzQwMi4wMSAzMDkuNzkgNDAyLjAxNCAzMDkuNzgyIDQwMi4wMTkgMzA5Ljc3MkM0MDIuMDI4IDMwOS43NTEgNDAyLjA0MyAzMDkuNzIgNDAyLjA2MiAzMDkuNjc4QzQwMi4xMDEgMzA5LjU5NSA0MDIuMTU4IDMwOS40NzEgNDAyLjIzNCAzMDkuMzA4QzQwMi4zODQgMzA4Ljk4MiA0MDIuNjA1IDMwOC41IDQwMi44ODggMzA3Ljg3NUM0MDMuNDUzIDMwNi42MjcgNDA0LjI2MyAzMDQuODExIDQwNS4yNDIgMzAyLjU0NkM0MDcuMTk5IDI5OC4wMTUgNDA5LjgzIDI5MS42ODkgNDEyLjUyMyAyODQuNTA2QzQxNy45MTkgMjcwLjExIDQyMy41MjMgMjUyLjM4IDQyNC41MTIgMjM4Ljc3Nkw0MjUuNSAyMzlMNDI2LjQ4OCAyMzkuMjI0QzQyNS40NzcgMjUzLjEyIDQxOS43ODcgMjcxLjA2MiA0MTQuMzg4IDI4NS40NjNDNDExLjY4MyAyOTIuNjc5IDQwOS4wNDEgMjk5LjAzMiA0MDcuMDc2IDMwMy41ODJDNDA2LjA5MyAzMDUuODU3IDQwNS4yNzkgMzA3LjY4MSA0MDQuNzEgMzA4LjkzOEM0MDQuNDI2IDMwOS41NjYgNDA0LjIwMyAzMTAuMDUyIDQwNC4wNTEgMzEwLjM4MkM0MDMuOTc1IDMxMC41NDcgNDAzLjkxNiAzMTAuNjcyIDQwMy44NzcgMzEwLjc1N0M0MDMuODU3IDMxMC43OTkgNDAzLjg0MiAzMTAuODMxIDQwMy44MzIgMzEwLjg1M0M0MDMuODI3IDMxMC44NjQgNDAzLjgyMyAzMTAuODcyIDQwMy44MjEgMzEwLjg3OEM0MDMuODE5IDMxMC44OCA0MDMuODE4IDMxMC44ODIgNDAzLjgxOCAzMTAuODg0QzQwMy44MTcgMzEwLjg4NSA0MDMuODE3IDMxMC44ODUgNDAzLjgxNyAzMTAuODg1QzQwMy44MTcgMzEwLjg4NiA0MDMuODE3IDMxMC44ODYgNDAyLjkxIDMxMC4zNDRaTTQyNS41IDIzOUw0MjQuNTEyIDIzOC43NzZDNDI1LjUwNCAyMjUuMTM0IDQyNC4wMTkgMjEwLjcwMyA0MjIuMjc4IDE5OS42NjJDNDIxLjQwOCAxOTQuMTQ2IDQyMC40NzYgMTg5LjQ4NyA0MTkuNzYyIDE4Ni4yMDhDNDE5LjQwNSAxODQuNTY4IDQxOS4xMDMgMTgzLjI3NSA0MTguODkgMTgyLjM5M0M0MTguNzgzIDE4MS45NTEgNDE4LjcgMTgxLjYxMyA0MTguNjQyIDE4MS4zODZDNDE4LjYxNCAxODEuMjcyIDQxOC41OTIgMTgxLjE4NyA0MTguNTc3IDE4MS4xM0M0MTguNTcgMTgxLjEwMSA0MTguNTY0IDE4MS4wOCA0MTguNTYxIDE4MS4wNjZDNDE4LjU1OSAxODEuMDU5IDQxOC41NTggMTgxLjA1NCA0MTguNTU3IDE4MS4wNUM0MTguNTU2IDE4MS4wNDkgNDE4LjU1NiAxODEuMDQ3IDQxOC41NTYgMTgxLjA0N0M0MTguNTU2IDE4MS4wNDYgNDE4LjU1NiAxODEuMDQ2IDQxOC41NTYgMTgxLjA0NkM0MTguNTU2IDE4MS4wNDYgNDE4LjU1NiAxODEuMDQ2IDQxOS41MTEgMTgwLjkyOEM0MjAuNDY2IDE4MC44MTEgNDIwLjQ2NiAxODAuODExIDQyMC40NjYgMTgwLjgxMUM0MjAuNDY2IDE4MC44MTIgNDIwLjQ2NiAxODAuODEyIDQyMC40NjYgMTgwLjgxM0M0MjAuNDY3IDE4MC44MTQgNDIwLjQ2NyAxODAuODE1IDQyMC40NjggMTgwLjgxOEM0MjAuNDY5IDE4MC44MjIgNDIwLjQ3IDE4MC44MjggNDIwLjQ3MiAxODAuODM1QzQyMC40NzYgMTgwLjg1MSA0MjAuNDgyIDE4MC44NzQgNDIwLjQ5IDE4MC45MDRDNDIwLjUwNiAxODAuOTY1IDQyMC41MjggMTgxLjA1NCA0MjAuNTU4IDE4MS4xNzFDNDIwLjYxNyAxODEuNDA1IDQyMC43MDIgMTgxLjc1IDQyMC44MTEgMTgyLjE5OUM0MjEuMDI3IDE4My4wOTYgNDIxLjMzMyAxODQuNDA1IDQyMS42OTQgMTg2LjA2MkM0MjIuNDE1IDE4OS4zNzUgNDIzLjM1NiAxOTQuMDc3IDQyNC4yMzMgMTk5LjY0MUM0MjUuOTg3IDIxMC43NjEgNDI3LjQ5NiAyMjUuMzY2IDQyNi40ODggMjM5LjIyNEw0MjUuNSAyMzlaTTQxOS41MTEgMTgwLjkyOEw0MTkuNzYyIDE4MS45MzJMMzczLjk1NSAxODcuMDEyTDM3My43MDQgMTg2LjAwOEwzNzMuNDUzIDE4NS4wMDRMNDE5LjI2IDE3OS45MjRMNDE5LjUxMSAxODAuOTI4Wk0zNzMuNzA0IDE4Ni4wMDhMMzc0LjIyMSAxODYuOTM4TDM1Ni44NDMgMTk0Ljk4OUwzNTYuMzI2IDE5NC4wNTlMMzU1LjgwOSAxOTMuMTI4TDM3My4xODcgMTg1LjA3N0wzNzMuNzA0IDE4Ni4wMDhaIiBmaWxsPSJ3aGl0ZSIgbWFzaz0idXJsKCNzdHJva2U3XzRfNDEpIi8+CjxwYXRoIGQ9Ik0xNDEuODc1IDM1NC4wMzJDMTYxLjMwOCAzNDIuMTczIDE4Ni42NzUgMzQ4LjMxNCAxOTguNTMzIDM2Ny43NDhMMjA0LjU1NCAzNzcuNjE0QzIxNi40MTIgMzk3LjA0NyAyMTAuMjcxIDQyMi40MTQgMTkwLjgzOCA0MzQuMjczQzE3MS40MDQgNDQ2LjEzMSAxNDYuMDM3IDQzOS45OSAxMzQuMTc5IDQyMC41NTdMMTI4LjE1OSA0MTAuNjlDMTE2LjMgMzkxLjI1NyAxMjIuNDQxIDM2NS44OSAxNDEuODc1IDM1NC4wMzJaIiBmaWxsPSJ3aGl0ZSIgc3Ryb2tlPSJ3aGl0ZSIvPgo8ZGVmcz4KPHBhdGggaWQ9InN0cm9rZTBfNF80MSIgZD0iTTQwMS43IDIxMi4yMDRDMzk2LjU3NyAyMTMuMDk0IDM5My4xMDkgMjExLjgyNyAzODguMDQ1IDIwOC45NjhDMzA3LjU5MyAxNjEuODMgMTc5LjY5NyAxNjkuMzc2IDEwNC4wODggMjE1LjU3OEMxMDAuNzgzIDIxNy41OSA5Ni43Mzc3IDIyMC41OTMgOTIuMDA4NSAyMjEuNDE0Qzc5LjAwMzIgMjIzLjY3MyA2Ni41NTU0IDIxMS4wMjQgNjMuMzMxNCAxOTIuNDYxQzYwLjAzNDcgMTczLjQ3OCA2Ni40NDQzIDE2MS4yOTMgNzQuNjgxMyAxNTYuMTI0QzEwNi44NjUgMTM1LjcyNSAxNDQuNDk3IDEyMi4xNDQgMTg2Ljc2NCAxMTQuODAzQzI1OC42ODcgMTAyLjMxMiAzMzcuNzQ0IDExMC40MzggNDAwLjcyMiAxNDYuMzc2QzQwOS40OTcgMTUxLjMyMiA0MTYuMDI1IDE1OS4xMDMgNDE4LjkxIDE3NS43MTNDNDIyLjIwNiAxOTQuNjk1IDQxMy43MiAyMTAuMTE2IDQwMS43IDIxMi4yMDRaTTM4OS42MjggMzIzLjg2NkMzODQuNTA1IDMyNC43NTYgMzgwLjQ5OSAzMjIuMTQ1IDM3Ni40OTIgMzIwLjEwOUMzMDUuOTQ0IDI3OS4xNTkgMjEwLjUwNyAyNzQuMzEgMTM0LjI4NCAzMTkuOUMxMjkuODcgMzIyLjUzNSAxMjcuNjIzIDMyNC43OTUgMTIzLjE4OSAzMjUuNTY1QzExMi42NDcgMzI3LjM5NiAxMDEuOTY3IDMxNi43NDEgOTkuMzcyOSAzMDEuODA2Qzk2Ljc3OTIgMjg2Ljg3MiAxMDAuMTgxIDI3Ni4wNzIgMTA5LjYyNyAyNzAuMjYyQzEzNS4xMjYgMjU0LjYxOCAxNjEuNzAxIDI0MS42NjMgMjAyLjY4OCAyMzQuNTQ1QzI2Ni42MyAyMjMuNDQgMzMyLjMwOCAyMzUuMTgzIDM4OC4xMDcgMjY3Ljc2NkMzOTcuMjUxIDI3My4wOCA0MDEuOTA2IDI4MS4xODYgNDA0LjAxNSAyOTMuMzI5QzQwNi41MzUgMzA4LjQyMSA0MDAuMzY3IDMyMi4wMDEgMzg5LjYyOCAzMjMuODY2WiIvPgo8cGF0aCBpZD0ic3Ryb2tlMl80XzQxIiBkPSJNNjMuOTYwMSAxOTYuNjY1TDEyNS41MDcgMTk3LjQ3OUwxNzQuODk5IDE4Ni43NDVDMTc0Ljg5OSAxODYuNzQ1IDEzOS4yODUgMjAwLjgzOCAxNDUuNDk4IDIyNC45MjJDMTUxLjcxIDI0OS4wMDYgMTc2LjEwNyAyNDAuNDU1IDE3Ni4xMDcgMjQwLjQ1NUwxMDEuNjYyIDMyMC4yNDVDMTAxLjY2MiAzMjAuMjQ1IDk2Ljk4MTcgMjc1Ljc2NSA4OC4wNTU4IDI1My41OUM3OS4xMjk4IDIzMS40MTUgNjMuOTYwMSAxOTYuNjY1IDYzLjk2MDEgMTk2LjY2NVoiLz4KPHBhdGggaWQ9InN0cm9rZTRfNF80MSIgZD0iTTk4LjY0NzMgMjk3LjA0NEwxNTAuODExIDMwOC4xMTRMMTc1LjgyMSAzMDAuMTc2QzE3NS44MjEgMzAwLjE3NiAxNzIgMzEyLjUgMTgyLjUgMzM1LjVDMTkzIDM1OC41IDIwMi41IDM3My41IDIwMi41IDM3My41TDEyOSA0MTMuNUMxMjkgNDEzLjUgMTEyLjQ2MyAzODMuMTAyIDEwNiAzNjAuNUM5OS41MzcyIDMzNy44OTggOTguNjQ3MyAyOTcuMDQ0IDk4LjY0NzMgMjk3LjA0NFoiLz4KPHBhdGggaWQ9InN0cm9rZTZfNF80MSIgZD0iTTQxOS41MTEgMTgwLjkyOEwzNzMuNzA0IDE4Ni4wMDhMMzU2LjMyNiAxOTQuMDU5QzM1Ni4zMjYgMTk0LjA1OSAzODMuNDEgMjA3Ljg2OSAzODEuNzA0IDIzMi4wNjhDMzc5Ljk5NyAyNTYuMjY4IDM1OS4xMTggMjUzLjk2NCAzNTkuMTE4IDI1My45NjRMNDAyLjkxIDMxMC4zNDRDNDAyLjkxIDMxMC4zNDQgNDIzLjUgMjY2LjUgNDI1LjUgMjM5QzQyNy41IDIxMS41IDQxOS41MTEgMTgwLjkyOCA0MTkuNTExIDE4MC45MjhaIi8+CjwvZGVmcz4KPC9zdmc+Cg==' };
  const ICON = {
    close: '<svg viewBox="0 0 16 16"><path d="M2.47 2.47a.75.75 0 0 1 1.06 0L8 6.94l4.47-4.47a.75.75 0 1 1 1.06 1.06L9.06 8l4.47 4.47a.75.75 0 1 1-1.06 1.06L8 9.06l-4.47 4.47a.75.75 0 0 1-1.06-1.06L6.94 8 2.47 3.53a.75.75 0 0 1 0-1.06"/></svg>',
    next: '<svg viewBox="0 0 16 16"><path d="M4.97.47a.75.75 0 0 0 0 1.06L11.44 8l-6.47 6.47a.75.75 0 1 0 1.06 1.06L13.56 8 6.03.47a.75.75 0 0 0-1.06 0"/></svg>',
    prev: '<svg viewBox="0 0 16 16"><path d="M11.03.47a.75.75 0 0 1 0 1.06L4.56 8l6.47 6.47a.75.75 0 1 1-1.06 1.06L2.44 8 9.97.47a.75.75 0 0 1 1.06 0"/></svg>',
    ext: '<svg viewBox="0 0 16 16"><path d="M1 2.75A.75.75 0 0 1 1.75 2H7v1.5H2.5v11h10.219V9h1.5v6.25a.75.75 0 0 1-.75.75H1.75a.75.75 0 0 1-.75-.75z"/><path d="M15 1v4.993a.75.75 0 1 1-1.5 0V3.56L8.78 8.28a.75.75 0 0 1-1.06-1.06l4.72-4.72h-2.433a.75.75 0 0 1 0-1.5z"/></svg>',
    pin: '<svg viewBox="0 0 16 16"><path d="M8.822.797a2.72 2.72 0 0 1 3.847 0l2.534 2.533a2.72 2.72 0 0 1 0 3.848l-3.678 3.678-1.337 4.988-4.486-4.486L1.28 15.78a.75.75 0 0 1-1.06-1.06l4.422-4.422L.156 5.812l4.987-1.337z"/></svg>',
    plus: '<svg viewBox="0 0 16 16"><path d="M15.25 8a.75.75 0 0 1-.75.75H8.75v5.75a.75.75 0 0 1-1.5 0V8.75H1.5a.75.75 0 0 1 0-1.5h5.75V1.5a.75.75 0 0 1 1.5 0v5.75h5.75a.75.75 0 0 1 .75.75"/></svg>',
    lib: '<svg viewBox="0 0 24 24"><path d="M10.97 5.47a.75.75 0 1 1 1.06 1.06L7.06 11.5h13.69a.75.75 0 0 1 0 1.5H7.06l4.97 4.97a.75.75 0 1 1-1.06 1.06L4.69 12.75a1.06 1.06 0 0 1 0-1.5zM3 3.75a.75.75 0 0 0-1.5 0v16.5a.75.75 0 0 0 1.5 0z"/></svg>',
    search: '<svg viewBox="0 0 16 16"><path d="M7 1.75a5.25 5.25 0 1 0 0 10.5 5.25 5.25 0 0 0 0-10.5M.25 7a6.75 6.75 0 1 1 12.096 4.12l3.184 3.185a.75.75 0 1 1-1.06 1.06L11.304 12.2A6.75 6.75 0 0 1 .25 7"/></svg>',
    list: '<svg viewBox="0 0 16 16"><path d="M15 14.5H5V13h10zm0-5.75H5v-1.5h10zM15 3H5V1.5h10zM3 3H1V1.5h2zm0 11.5H1V13h2zm0-5.75H1v-1.5h2z"/></svg>',
    eye: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 5C6.5 5 2.7 9.2 1.5 12c1.2 2.8 5 7 10.5 7s9.3-4.2 10.5-7C21.3 9.2 17.5 5 12 5m0 11.5a4.5 4.5 0 1 1 0-9 4.5 4.5 0 0 1 0 9m0-2.2a2.3 2.3 0 1 0 0-4.6 2.3 2.3 0 0 0 0 4.6"/></svg>',
    gear: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19.14 12.94c.04-.3.06-.61.06-.94s-.02-.64-.07-.94l2.03-1.58a.5.5 0 0 0 .12-.64l-1.92-3.32a.5.5 0 0 0-.61-.22l-2.39.96a7 7 0 0 0-1.62-.94l-.36-2.54a.5.5 0 0 0-.5-.42h-3.84a.5.5 0 0 0-.5.42l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96a.5.5 0 0 0-.61.22L2.74 8.84a.5.5 0 0 0 .12.64l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58a.5.5 0 0 0-.12.64l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.26.42.5.42h3.84c.24 0 .45-.18.5-.42l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32a.5.5 0 0 0-.12-.64zM12 15.6A3.6 3.6 0 1 1 12 8.4a3.6 3.6 0 0 1 0 7.2z"/></svg>',
    wand: '<svg viewBox="0 0 16 16"><path d="M11.9 1.1a1.5 1.5 0 0 1 2.1 0l.9.9a1.5 1.5 0 0 1 0 2.1L4.1 14.9a1.5 1.5 0 0 1-2.1 0l-.9-.9a1.5 1.5 0 0 1 0-2.1zm-1 3.1L2.2 12.9l.9.9 8.7-8.7zM4 .5l.5 1.5L6 2.5 4.5 3 4 4.5 3.5 3 2 2.5 3.5 2zm9 9 .5 1.5 1.5.5-1.5.5-.5 1.5-.5-1.5-1.5-.5 1.5-.5z"/></svg>',
  };

  /* ================= idiomas: PT é a chave; {n} = nome do artista ================= */
  const LANGS = { pt: 'Português', en: 'English', es: 'Español', fr: 'Français', de: 'Deutsch' };
  const T = [
    ['O que você quer ouvir?', 'What do you want to play?', '¿Qué quieres reproducir?', 'Que souhaitez-vous écouter ?', 'Was möchtest du hören?'],
    // pt | en | es | fr | de
    ['Pular para o conteúdo principal', 'Skip to main content', 'Saltar al contenido principal', 'Passer au contenu principal', 'Zum Hauptinhalt springen'],
    ['O que você quer ouvir?', 'What do you want to play?', '¿Qué quieres reproducir?', 'Que souhaitez-vous écouter ?', 'Was möchtest du hören?'],
    ['Ver planos Premium', 'Explore Premium', 'Explorar Premium', 'Découvrir Premium', 'Premium entdecken'],
    ['Instalar aplicativo', 'Install App', 'Instalar app', "Installer l'appli", 'App installieren'],
    ['Sua Biblioteca', 'Your Library', 'Tu biblioteca', 'Bibliothèque', 'Bibliothek'],
    ['Criar', 'Create', 'Crear', 'Créer', 'Erstellen'],
    ['Artistas', 'Artists', 'Artistas', 'Artistes', 'Künstler'],
    ['Recentes', 'Recents', 'Recientes', 'Récents', 'Zuletzt'],
    ['Artista', 'Artist', 'Artista', 'Artiste', 'Künstler'],
    ['Verificado pelo Spotify', 'Verified Artist', 'Artista verificado', 'Artiste vérifié', 'Verifizierter Künstler'],
    ['ouvintes mensais', 'monthly listeners', 'oyentes mensuales', 'auditeurs mensuels', 'monatliche Hörer'],
    ['Ouvintes mensais', 'Monthly listeners', 'Oyentes mensuales', 'Auditeurs mensuels', 'Monatliche Hörer'],
    ['Seguidores', 'Followers', 'Seguidores', 'Abonnés', 'Follower'],
    ['Seguir', 'Follow', 'Seguir', "S'abonner", 'Folgen'],
    ['Populares', 'Popular', 'Populares', 'Populaires', 'Beliebt'],
    ['Ver mais', 'See more', 'Ver más', 'Voir plus', 'Mehr anzeigen'],
    ['Escolha do artista', 'Artist pick', 'Selección del artista', "Choix de l'artiste", 'Künstler-Tipp'],
    ['Discografia', 'Discography', 'Discografía', 'Discographie', 'Diskografie'],
    ['Mostrar tudo', 'Show all', 'Mostrar todo', 'Tout afficher', 'Alle anzeigen'],
    ['Lançamentos populares', 'Popular releases', 'Lanzamientos populares', 'Sorties populaires', 'Beliebte Releases'],
    ['Álbuns', 'Albums', 'Álbumes', 'Albums', 'Alben'],
    ['Singles e EPs', 'Singles and EPs', 'Sencillos y EP', 'Singles et EP', 'Singles und EPs'],
    ['Compilações', 'Compilations', 'Recopilatorios', 'Compilations', 'Compilations'],
    ['Último lançamento •', 'Latest Release •', 'Último lanzamiento •', 'Dernière sortie •', 'Neueste Veröffentlichung •'],
    ['Álbum', 'Album', 'Álbum', 'Album', 'Album'],
    ['Com {n}', 'Featuring {n}', 'Con {n}', 'Avec {n}', 'Mit {n}'],
    ['Videoclipes', 'Music videos', 'Videoclips', 'Clips', 'Musikvideos'],
    ['Veja mais de {n}', 'More from {n}', 'Más de {n}', 'Plus de {n}', 'Mehr von {n}'],
    ['Rádio de {n}', '{n} Radio', 'Radio de {n}', 'Radio {n}', '{n} Radio'],
    ['Em turnê', 'On tour', 'De gira', 'En tournée', 'Auf Tour'],
    ['ver todos os próximos shows (20)', 'see all upcoming concerts (20)', 'ver todos los próximos conciertos (20)', 'voir tous les concerts à venir (20)', 'alle kommenden Konzerte anzeigen (20)'],
    ['Sobre', 'About', 'Información', 'À propos', 'Über'],
    ['no mundo', 'in the world', 'en el mundo', 'dans le monde', 'weltweit'],
    ['Loja', 'Merch', 'Tienda', 'Boutique', 'Merch'],
    ['Descobertos em', 'Discovered on', 'Descubierto en', 'Découvert sur', 'Entdeckt auf'],
    ['Playlists do artista', 'Artist playlists', 'Playlists del artista', "Playlists de l'artiste", 'Künstler-Playlists'],
    ['Os fãs também curtem', 'Fans also like', 'A los fans también les gusta', 'Les fans aiment aussi', 'Fans mögen auch'],
    ['Aparece em', 'Appears on', 'Aparece en', 'Apparaît sur', 'Erscheint auf'],
    ['Mudar para vídeo', 'Switch to video', 'Cambiar a video', 'Passer à la vidéo', 'Zu Video wechseln'],
    ['Prévia da letra', 'Lyrics preview', 'Vista previa de la letra', 'Aperçu des paroles', 'Songtext-Vorschau'],
    ['Mostrar mais', 'Show more', 'Mostrar más', 'Afficher plus', 'Mehr anzeigen'],
    ['Videoclipes relacionados', 'Related music videos', 'Videoclips relacionados', 'Clips associés', 'Ähnliche Musikvideos'],
    ['Sobre o artista', 'About the artist', 'Acerca del artista', "À propos de l'artiste", 'Über den Künstler'],
    ['Créditos', 'Credits', 'Créditos', 'Crédits', 'Credits'],
    ['Artista principal', 'Main Artist', 'Artista principal', 'Artiste principal', 'Hauptkünstler'],
    ['Autores', 'Composers', 'Compositores', 'Compositeurs', 'Komponisten'],
    ['Letrista', 'Lyricist', 'Letrista', 'Parolier', 'Texter'],
    ['Produção', 'Producer', 'Producción', 'Production', 'Produktion'],
    ['A seguir', 'Next in queue', 'A continuación', 'À suivre', 'Als Nächstes'],
    ['Abrir fila', 'Open queue', 'Abrir cola', "Ouvrir la file d'attente", 'Warteschlange öffnen'],
    ['Fixado', 'Pinned', 'Fijado', 'Épinglé', 'Angeheftet'],
    ['Conta', 'Account', 'Cuenta', 'Compte', 'Konto'],
    ['Perfil', 'Profile', 'Perfil', 'Profil', 'Profil'],
    ['Faça upgrade para o Premium', 'Upgrade to Premium', 'Mejorar a Premium', 'Passer à Premium', 'Upgrade auf Premium'],
    ['Suporte', 'Support', 'Asistencia', 'Assistance', 'Support'],
    ['Baixar', 'Download', 'Descargar', 'Télécharger', 'Herunterladen'],
    ['Configurações', 'Settings', 'Configuración', 'Paramètres', 'Einstellungen'],
    ['Sair', 'Log out', 'Cerrar sesión', 'Se déconnecter', 'Abmelden'],
    ['SpotiPreview é uma ferramenta não oficial de pré-visualização, sem vínculo, patrocínio ou aprovação do Spotify. Spotify, seus logotipos, marcas e conteúdos pertencem aos seus respectivos donos, que detêm todos os direitos.',
     'SpotiPreview is an unofficial preview tool and is not affiliated with, sponsored or endorsed by Spotify. Spotify, its logos, trademarks and content belong to their respective owners, who hold all rights.',
     'SpotiPreview es una herramienta de vista previa no oficial, sin relación, patrocinio ni aprobación de Spotify. Spotify, sus logotipos, marcas y contenidos pertenecen a sus respectivos dueños, que tienen todos los derechos.',
     "SpotiPreview est un outil d'aperçu non officiel, sans lien, parrainage ni approbation de Spotify. Spotify, ses logos, marques et contenus appartiennent à leurs propriétaires respectifs, qui en détiennent tous les droits.",
     'SpotiPreview ist ein inoffizielles Vorschau-Tool und steht in keiner Verbindung zu Spotify, wird weder gesponsert noch unterstützt. Spotify, seine Logos, Marken und Inhalte gehören ihren jeweiligen Inhabern, die alle Rechte besitzen.'],
  ];
  const LI = Object.keys(LANGS);
  const tr = pt => { const r = T.find(x => x[0] === pt); return r ? r[LI.indexOf(S.lang || 'en')] : pt; };
  // textos do próprio editor (menu, gaveta, configurações, dicas): pt | en | es | fr | de
  const U = {
    modify: ['Modificar página', 'Customize page', 'Personalizar página', 'Personnaliser la page', 'Seite anpassen'],
    set_lang: ['Idioma da página', 'Page language', 'Idioma de la página', 'Langue de la page', 'Seitensprache'],
    set_lib: ['Biblioteca expandida', 'Expanded library', 'Biblioteca expandida', 'Bibliothèque étendue', 'Erweiterte Bibliothek'],
    set_npv: ['Painel "Tocando agora" aberto', '"Now playing" panel open', 'Panel "Reproduciendo" abierto', 'Panneau « En cours de lecture » ouvert', 'Bereich „Wiedergabe“ geöffnet'],
    set_prof: ['Foto de perfil', 'Profile picture', 'Foto de perfil', 'Photo de profil', 'Profilbild'],
    info: ['Informações', 'Information', 'Información', 'Informations', 'Informationen'],
    info_1: ['Uma prévia gratuita e editável da página de artista do Spotify. Artistas podem testar como ficam um novo banner, fotos, nome, números e seções antes de usar no Spotify de verdade.', 'A free, editable preview of a Spotify artist page. Artists can test how a new banner, photos, name, numbers and sections look before using them on the real thing.', 'Una vista previa gratuita y editable de una página de artista de Spotify. Los artistas pueden probar cómo quedan un nuevo banner, fotos, nombre, números y secciones antes de usarlos de verdad.', "Un aperçu gratuit et modifiable d'une page d'artiste Spotify. Les artistes peuvent tester le rendu d'une nouvelle bannière, de photos, d'un nom, de chiffres et de sections avant de les utiliser pour de vrai.", 'Eine kostenlose, bearbeitbare Vorschau einer Spotify-Künstlerseite. Künstler können testen, wie ein neues Banner, Fotos, Name, Zahlen und Bereiche aussehen, bevor sie sie wirklich verwenden.'],
    info_2: ['Tudo roda no seu navegador. Nada é enviado para nenhum servidor.', 'Everything runs in your browser. Nothing is uploaded and nothing is sent to any server.', 'Todo se ejecuta en tu navegador. No se sube nada ni se envía a ningún servidor.', "Tout fonctionne dans votre navigateur. Rien n'est envoyé à un serveur.", 'Alles läuft in deinem Browser. Es wird nichts hochgeladen oder an einen Server gesendet.'],
    info_h: ['Aviso', 'Disclaimer', 'Aviso legal', 'Avertissement', 'Hinweis'],
    info_3: ['O SpotiPreview é uma ferramenta não oficial e sem fins lucrativos. Não tem vínculo, apoio ou patrocínio do Spotify AB.', 'SpotiPreview is an unofficial, non-profit tool. It is not affiliated with, endorsed by or sponsored by Spotify AB.', 'SpotiPreview es una herramienta no oficial y sin ánimo de lucro. No está afiliada, respaldada ni patrocinada por Spotify AB.', "SpotiPreview est un outil non officiel et à but non lucratif. Il n'est ni affilié, ni approuvé, ni parrainé par Spotify AB.", 'SpotiPreview ist ein inoffizielles, nicht kommerzielles Tool. Es steht in keiner Verbindung zu Spotify AB und wird von Spotify AB weder unterstützt noch gesponsert.'],
    info_4: ['Se o Spotify (ou seus representantes) pedir, este projeto será removido o mais rápido possível.', 'If Spotify (or its representatives) requests it, this project will be removed as soon as possible.', 'Si Spotify (o sus representantes) lo solicita, este proyecto se eliminará lo antes posible.', 'Si Spotify (ou ses représentants) en fait la demande, ce projet sera supprimé dès que possible.', 'Auf Wunsch von Spotify (oder seinen Vertretern) wird dieses Projekt so schnell wie möglich entfernt.'],
    info_ok: ['Entendi', 'Got it', 'Entendido', 'Compris', 'Verstanden'],
    set_logo: ['Usar a logo oficial do Spotify', 'Use the official Spotify logo', 'Usar el logo oficial de Spotify', 'Utiliser le logo officiel de Spotify', 'Offizielles Spotify-Logo verwenden'],
    set_hint: ['O idioma muda os textos do Spotify e o formato dos números. Nomes de músicas e artistas continuam iguais.', 'The language changes the Spotify texts and the number format. Song and artist names stay the same.', 'El idioma cambia los textos de Spotify y el formato de los números. Los nombres de canciones y artistas no cambian.', 'La langue change les textes de Spotify et le format des nombres. Les noms des titres et artistes restent identiques.', 'Die Sprache ändert die Spotify-Texte und das Zahlenformat. Titel- und Künstlernamen bleiben gleich.'],
    mk_title: ['Marcadores de texto', 'Text markers', 'Marcadores de texto', 'Marqueurs de texte', 'Textmarker'],
    mk_hint: ['Escreva um marcador ao editar qualquer texto da página. Ao confirmar, ele vira o valor.', 'Type a marker while editing any text on the page. When you confirm, it becomes the value.', 'Escribe un marcador al editar cualquier texto de la página. Al confirmar, se convierte en el valor.', 'Saisissez un marqueur en modifiant un texte de la page. À la validation, il devient la valeur.', 'Gib beim Bearbeiten eines Textes einen Marker ein. Beim Bestätigen wird er durch den Wert ersetzt.'],
    mk_artist: ['Nome do artista', 'Artist name', 'Nombre del artista', "Nom de l'artiste", 'Künstlername'],
    mk_ARTIST: ['Nome em MAIÚSCULAS', 'Name in CAPITALS', 'Nombre en MAYÚSCULAS', 'Nom en MAJUSCULES', 'Name in GROSSBUCHSTABEN'],
    mk_listeners: ['Ouvintes mensais', 'Monthly listeners', 'Oyentes mensuales', 'Auditeurs mensuels', 'Monatliche Hörer'],
    mk_followers: ['Seguidores', 'Followers', 'Seguidores', 'Abonnés', 'Follower'],
    mk_rank: ['Posição no ranking', 'Ranking position', 'Posición en el ranking', 'Position au classement', 'Ranglistenplatz'],
    mk_year: ['Ano atual', 'Current year', 'Año actual', 'Année en cours', 'Aktuelles Jahr'],
    d_sub: ['Ligue, desligue e arraste as seções', 'Toggle and drag the sections', 'Activa, desactiva y arrastra las secciones', 'Activez, désactivez et déplacez les sections', 'Abschnitte ein-/ausblenden und verschieben'],
    d_rank: ['Ranking mundial', 'World ranking', 'Ranking mundial', 'Classement mondial', 'Weltrangliste'],
    d_theme: ['Cor do topo', 'Header color', 'Color de la cabecera', "Couleur de l'en-tête", 'Kopfzeilenfarbe'],
    d_theme_auto: ['(automática pelo banner)', '(automatic from the banner)', '(automático según el banner)', '(automatique selon la bannière)', '(automatisch vom Banner)'],
    d_sections: ['Seções', 'Sections', 'Secciones', 'Sections', 'Abschnitte'],
    d_count: ['O número ao lado de cada seção é a quantidade de itens (até 10). Como no Spotify, só aparece o que cabe em uma linha; feche o painel "Tocando agora" para caber mais.', 'The number next to each section is how many items it shows (up to 10). As on Spotify, only what fits in one row is visible; close the "Now playing" panel to fit more.', 'El número junto a cada sección es la cantidad de elementos (hasta 10). Como en Spotify, solo se ve lo que cabe en una fila; cierra el panel "Reproduciendo" para que quepan más.', 'Le nombre à côté de chaque section est le nombre d’éléments (jusqu’à 10). Comme sur Spotify, seul ce qui tient sur une ligne est visible ; fermez le panneau « En cours de lecture » pour en afficher plus.', 'Die Zahl neben jedem Abschnitt ist die Anzahl der Elemente (bis 10). Wie bei Spotify ist nur sichtbar, was in eine Zeile passt; schließe den Bereich „Wiedergabe“, damit mehr passt.'],
    d_tip: ['Dica: textos e números da página são editáveis direto nela — passe o mouse e clique. Use marcadores como [artist] (veja em Configurações).', 'Tip: texts and numbers on the page are editable right there — hover and click. Use markers like [artist] (see Settings).', 'Consejo: los textos y números de la página se editan directamente: pasa el ratón y haz clic. Usa marcadores como [artist] (ver Configuración).', 'Astuce : les textes et nombres de la page se modifient directement : survolez et cliquez. Utilisez des marqueurs comme [artist] (voir Paramètres).', 'Tipp: Texte und Zahlen auf der Seite sind direkt bearbeitbar – darüberfahren und klicken. Nutze Marker wie [artist] (siehe Einstellungen).'],
    d_dl: ['Baixar .html', 'Download .html', 'Descargar .html', 'Télécharger .html', '.html herunterladen'],
    d_open: ['Abrir preview', 'Open preview', 'Abrir vista previa', "Ouvrir l'aperçu", 'Vorschau öffnen'],
    grip: ['Arraste para reordenar', 'Drag to reorder', 'Arrastra para reordenar', 'Glisser pour réorganiser', 'Zum Umsortieren ziehen'],
    cnt: ['Quantidade de itens', 'Number of items', 'Cantidad de elementos', "Nombre d'éléments", 'Anzahl der Elemente'],
    tip_card: ['✎ Editável · clique para ver as opções de edição', '✎ Editable · click to see edit options', '✎ Editable · clic para ver las opciones de edición', "✎ Modifiable · cliquez pour voir les options d'édition", '✎ Bearbeitbar · Klicken für die Bearbeitungsoptionen'],
    tip_edit: ['✎ Clique para editar', '✎ Click to edit', '✎ Clic para editar', '✎ Cliquer pour modifier', '✎ Klicken zum Bearbeiten'],
    drop: ['Solte para trocar', 'Drop to replace', 'Suelta para reemplazar', 'Déposer pour remplacer', 'Zum Ersetzen ablegen'],
    drag_img: ['⬆ Arraste ou clique para trocar a imagem', '⬆ Drag or click to change the image', '⬆ Arrastra o haz clic para cambiar la imagen', "⬆ Glisser ou cliquer pour changer l'image", '⬆ Ziehen oder klicken, um das Bild zu ändern'],
    drag_banner: ['⬆ Arraste ou clique para trocar o banner (2660×1140)', '⬆ Drag or click to change the banner (2660×1140)', '⬆ Arrastra o haz clic para cambiar el banner (2660×1140)', '⬆ Glisser ou cliquer pour changer la bannière (2660×1140)', '⬆ Ziehen oder klicken, um das Banner zu ändern (2660×1140)'],
    drag_card: ['⬆ Arraste uma imagem aqui · clique para abrir', '⬆ Drop an image here · click to open', '⬆ Suelta una imagen aquí · clic para abrir', '⬆ Déposez une image ici · cliquez pour ouvrir', '⬆ Bild hier ablegen · Klicken zum Öffnen'],
    add_photo: ['＋ Adicionar foto', '＋ Add photo', '＋ Añadir foto', '＋ Ajouter une photo', '＋ Foto hinzufügen'],
    preview_btn: ['Preview', 'Preview', 'Vista previa', 'Aperçu', 'Vorschau'],
    guide: ['Comece por aqui: clique na engrenagem para personalizar a página e achar mais opções', 'Start here: click the gear to customize the page and find more options', 'Empieza aquí: haz clic en el engranaje para personalizar la página y ver más opciones', 'Commencez ici : cliquez sur l’engrenage pour personnaliser la page et voir plus d’options', 'Starte hier: Klicke auf das Zahnrad, um die Seite anzupassen und weitere Optionen zu finden'],
    bio: ['Escreva aqui a biografia do artista. Clique para editar — você pode usar marcadores como [artist].', 'Write the artist biography here. Click to edit — you can use markers like [artist].', 'Escribe aquí la biografía del artista. Haz clic para editar: puedes usar marcadores como [artist].', "Écrivez ici la biographie de l'artiste. Cliquez pour modifier — vous pouvez utiliser des marqueurs comme [artist].", 'Schreibe hier die Biografie des Künstlers. Zum Bearbeiten klicken – du kannst Marker wie [artist] verwenden.'],
  };
  const u = k => U[k][LI.indexOf(S.lang || 'en')];
  const refreshUI = () => $$('[data-ui]').forEach(e => { e.textContent = u(e.dataset.ui); });
  // marcadores: [artist] [ARTIST] [listeners] [followers] [rank] [year]
  const expand = v => v.replace(/\[(artist|listeners|followers|rank|year)\]/gi, (m, k) => {
    const K = k.toLowerCase();
    return K === 'artist' ? (k === 'ARTIST' ? S.name.toUpperCase() : S.name) : K === 'year' ? new Date().getFullYear() : full(S[K]);
  });
  // sem guardar originais: qualquer idioma -> linha da tabela, então pt→en→es→pt funciona, inclusive no preview
  function applyLang(lang) {
    const fill = v => v.split('{n}').join(S.name || '');
    const from = new Map(); T.forEach(r => r.forEach(v => from.set(fill(v), r)));
    const li = LI.indexOf(lang);
    const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT); let t;
    while ((t = w.nextNode())) {
      if (t.parentElement.closest('.sp-ui, [data-sp-field], .sp-editing')) continue;
      const v = t.nodeValue, k = v.trim(), r = k && from.get(k);
      if (r) t.nodeValue = v.replace(k, fill(r[li]));
      else if (/^\d{1,3}([.,\u00a0\u202f]\d{3})+$/.test(k)) t.nodeValue = v.replace(k, (+k.replace(/\D/g, '')).toLocaleString(LOCALE[lang]));
    }
    $$('input[placeholder]').forEach(i => { const r = from.get(i.placeholder.trim()); if (r) i.placeholder = fill(r[li]); });
    if (U.bio.includes(S.bio)) S.bio = U.bio[li]; // biografia ainda é o texto de exemplo: acompanha o idioma
    S.lang = lang; root.lang = LOCALE[lang]; save(); refreshUI(); render('bio');
    ['listeners', 'followers', 'rank'].forEach(render);
  }

  /* ================= estado (guardado no <html> para ir junto no preview) ================= */
  const S = JSON.parse(root.dataset.sp || '{}');
  const save = () => { root.dataset.sp = JSON.stringify(S); };
  const render = f => $$(`[data-sp-field="${f}"]`).forEach(e => { if (e !== editing) e.textContent = FMT[e.dataset.fmt || 'text'](S[f]); });

  /* ================= montagem (só na primeira vez; o preview já recebe tudo montado) ================= */
  function build() {
    // campos especiais
    const title = $('[data-testid="adaptiveEntityTitle"] > span');
    if (title) title.dataset.spField = 'name';
    S.lang = 'en';
    S.name = title ? title.textContent.trim() : 'Artist Name';
    document.title = S.name + ' | SpotiPreview';
    const foot = $('main footer');
    if (foot) foot.innerHTML = `<p class="sp-disclaimer e-101111-text encore-text-body-small encore-internal-color-text-subdued">${T.at(-1)[0]}</p>`;

    const card = $('.MlkW0fv77Gj2GiBCK8Yo');
    const cardInfo = card && $('.irV_48nN7TKAIQfdGP2i', card);
    const pb = $('[data-testid="playback-progressbar"]');
    $$('[style*="--progress-bar-transform"]').filter(e => pb && (e.contains(pb) || pb.contains(e) || e.parentElement?.contains(pb))).slice(0, 1).forEach(e => e.style.setProperty('--progress-bar-transform', '0%'));
    S.listeners = 0; // começa zerado (as reproduções das músicas também)
    $$('[role="gridcell"][aria-colindex="3"] > div').forEach(d => { if (/^[\d.,\s]+$/.test(d.textContent.trim())) d.textContent = '0'; });
    $$('[data-testid="tracklist-row"] *, [data-testid="playback-position"] *, [data-testid="playback-duration"] *').forEach(d => { if (!d.children.length && /^\d{1,2}:\d{2}$/.test(d.textContent.trim())) d.textContent = '0:00'; });
    S.followers = 0;
    S.rank = 1;
    S.bio = U.bio[0]; // texto de exemplo (a biografia real do HTML original não é usada)

    const hdr = $('.v5vKlAh6yT9PQwzT9CPY');
    if (hdr) hdr.innerHTML = '<span data-sp-field="listeners" data-fmt="short"></span> ouvintes mensais';
    if (cardInfo) cardInfo.firstElementChild.innerHTML = '<span data-sp-field="listeners" data-fmt="full"></span> ouvintes mensais';
    const bio = $('.ipbSyORzunKXC2aXR5Dr');
    if (bio) bio.dataset.spField = 'bio';
    const badge = $('.xacnehXOfYlnnCHprcjv');
    if (badge) { badge.classList.add('sp-rank'); badge.firstElementChild.dataset.spField = 'rank'; badge.firstElementChild.dataset.fmt = 'rank'; }

    // card "Sobre" vira div (texto dentro de <button> não é editável no Chrome)
    if (card) { const d = unbutton(card); d.dataset.spCard = ''; }

    $('[data-testid="global-nav-bar"] a:has(svg[data-encore-id="logoSpotify"])')?.append(el(`<img class="sp-logo" alt="SpotiPreview" src="${LOGO.white}">`));
    const fig = $('[data-testid="user-widget-avatar"]');
    if (fig) { fig.innerHTML = ICON.gear; fig.removeAttribute('title'); const ub = fig.closest('button'); ub?.setAttribute('aria-label', 'Menu'); ub?.querySelector('._26TkdqR1BnDsrUTINfW')?.remove(); }

    // nomes reais escondidos em dicas (title), textos alternativos e rótulos de botões
    $$('#main [title], .zWzxvh50CPFKsFBEe6uX [title], [data-testid="now-playing-bar"] [title]').forEach(e => { const v = e.textContent.trim(); if (v) e.title = v; else e.removeAttribute('title'); });
    $$('a[href]').forEach(x => x.setAttribute('href', '#')); // links do Spotify real apareciam na barra de status; sem href o estilo muda
    $$('#main img[alt], .zWzxvh50CPFKsFBEe6uX img[alt]').forEach(i => { i.alt = ''; });
    $$('[aria-label^="Tocar "], [aria-label^="Pausar "], [aria-label^="Mais opções para "]').forEach(e => e.setAttribute('aria-label', e.getAttribute('aria-label').replace(/^(Tocar|Pausar|Mais opções para) .*/, '$1')));

    tagSections();
    // começa quase tudo desligado: só estas seções ficam (nomes do HTML original, em português)
    const KEEP = ['Populares', 'Discografia', 'Playlists do artista', 'Sobre'];
    $$('[data-sp-sec]').forEach(x => { if (!KEEP.includes($('h2', x)?.textContent.trim())) x.classList.add('sp-off'); });
    buildAbout(card);
    $('[data-testid="entity-header"]')?.append(el(`<div id="sp-profile" data-k="profile" style="background-image:url(&quot;${PH}&quot;)"></div>`));
    buildLibrary();
    skeletonPanel(); skeletonSidebar();
    S.song = 'Song Title'; // título da música: barra de baixo, painel e 1ª linha de Popular andam juntos
    [$('[data-testid="now-playing-widget-v2"]'), $('.D7OEPKy5xCQIi_jeGX1p'), $('[data-testid="internal-track-link"]')].forEach(c => {
      const t = c && $$('*', c).find(x => !x.children.length && x.textContent.trim() === S.song); if (t) t.dataset.spField = 'song';
    });
    document.body.append(
      el('<div id="sp-wm-tag">Made with SpotiPreview</div>'),
      el('<div id="sp-menu" class="sp-ui"></div>'),
    );
    save();
    applyLang('en');
  }

  function unbutton(b) {
    const d = document.createElement('div');
    for (const a of b.attributes) d.setAttribute(a.name, a.value);
    d.setAttribute('role', 'button');
    d.style.display = getComputedStyle(b).display === 'inline-block' ? 'inline-block' : d.style.display;
    d.append(...b.childNodes);
    b.replaceWith(d);
    return d;
  }

  function tagSections() {
    const page = $('[data-testid="artist-page"]');
    let i = 0;
    $$('h2', page).forEach(h => {
      const cs = h.closest('.contentSpacing');
      if (!cs || cs.closest('[data-testid="entity-header"]')) return;
      let block = h; while (block.parentElement !== cs) block = block.parentElement;
      let unit = block;
      const grid = h.closest('[data-testid="grid-container"]');
      if (grid && block.contains(grid)) { unit = h; while (unit.parentElement !== grid) unit = unit.parentElement; }
      if (unit.dataset.spSec) return;
      unit.dataset.spSec = 's' + i++;
      block.dataset.spBlock = '';
      if (!cs.id) cs.id = 'sp-sections';
    });
  }

  function buildAbout(card) {
    const k = card?.dataset.k || '';
    const m = el(`
      <div id="sp-about-modal" role="dialog" aria-modal="true">
        <div class="sp-about-dialog">
          <div class="sp-about-media">
            <button class="sp-mctl sp-addphoto sp-edit-only" data-ui="add_photo"></button>
            <button class="sp-mctl sp-mclose" aria-label="Fechar">${ICON.close}</button>
            <button class="sp-mctl sp-mprev" aria-label="Anterior" hidden>${ICON.prev}</button>
            <button class="sp-mctl sp-mnext" aria-label="Próxima" hidden>${ICON.next}</button>
            <img class="on" alt="" data-k="${k}" src="${bgUrl(card) || ''}">
          </div>
          <div class="sp-about-info">
            <div class="sp-about-stats">
              <div class="sp-badge sp-rank"><b data-sp-field="rank" data-fmt="rank"></b><small>no mundo</small></div>
              <div class="sp-stat"><b data-sp-field="followers" data-fmt="full"></b><small>Seguidores</small></div>
              <div class="sp-stat"><b data-sp-field="listeners" data-fmt="full"></b><small>Ouvintes mensais</small></div>
            </div>
            <p class="sp-about-bio" data-sp-field="bio"></p>
          </div>
        </div>
      </div>`);
    document.body.append(m);
  }

  /* ---- "ainda carregando": retângulos cinza no lugar do que não precisa ser editado ---- */
  const bar = (w, cls = '') => `<i class="sp-sk-bar ${cls}" style="width:${w}%"></i>`;
  const simg = (cls = '') => `<i class="sp-sk-img ${cls}"><b>SpotiPreview</b></i>`;
  const BLANK = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
  function skeletonPanel() {
    $('.gDhODv4YfJfxJH2ALUcq')?.remove(); // "Mudar para vídeo"
    const body = {
      'Prévia da letra': `<div class="sp-sk-lyr">${[90, 70, 82, 55, 66].map(w => bar(w)).join('')}</div>`,
      'Videoclipes relacionados': `<div class="sp-sk-row">${[1, 2, 3].map(() => `<div class="sp-sk-card">${simg()}${bar(80)}${bar(50, 's')}</div>`).join('')}</div>`,
      'Sobre o artista': `<div class="sp-sk-card">${simg('tall')}${bar(55)}${bar(92, 's')}${bar(78, 's')}</div>`,
      'Créditos': [1, 2, 3].map(() => bar(45) + bar(28, 's')).join(''),
      'Loja': `<div class="sp-sk-row">${[1, 2, 3].map(() => simg('sq')).join('')}</div>`,
      'A seguir': [1, 2].map(() => `<div class="sp-sk-line">${simg('sq mini')}<div>${bar(60)}${bar(35, 's')}</div></div>`).join(''),
    };
    $$('.YobB51jI5MqFtV09iBY1 > *, .owI4gt1kVOH6yrqRhRuA > *').forEach(sec => {
      const h = $('h2', sec)?.textContent.trim();
      if (h && body[h]) sec.innerHTML = `<div class="sp-sk-h">${h}</div>` + body[h];
      if (h === 'Videoclipes relacionados') sec.style.padding = '0 8px 8px';
    });
  }
  // barra lateral só para visualização: sem fotos, sem edição (abrir/recolher continua)
  function skeletonSidebar() {
    $$('#Desktop_LeftSidebar_Id img').forEach(i => { i.src = BLANK; i.removeAttribute('data-k'); i.removeAttribute('srcset'); i.classList.add('sp-sk-sidebar'); });
  }

  function buildLibrary() {
    const nav = $('#Desktop_LeftSidebar_Id nav');
    if (!nav) return;
    const rows = $$('#Desktop_LeftSidebar_Id [role="row"]').filter(r => $('img', r));
    const items = rows.map(r => {
      const texts = []; const w = document.createTreeWalker(r, NodeFilter.SHOW_TEXT); let t;
      while ((t = w.nextNode())) { const v = t.nodeValue.trim(); if (v && !t.parentElement.closest('.e-101111-visually-hidden')) texts.push(v); }
      const img = $('img', r);
      return { k: img.dataset.k, src: img.getAttribute('src'), t: texts[0] || '', pin: texts.includes('Fixado'), s: texts[texts.length - 1] || '' };
    });
    const lib = el(`
      <div class="sp-lib">
        <div class="sp-lib-head">
          <div class="sp-lib-title"><button class="sp-lib-collapse" aria-label="Recolher Sua Biblioteca">${ICON.lib}</button><span>Sua Biblioteca</span></div>
          <button class="sp-lib-create">${ICON.plus}<span>Criar</span></button>
        </div>
        <div class="sp-chips"><span>Playlists</span><span>Artistas</span><span>Álbuns</span></div>
        <div class="sp-lib-tools">${ICON.search}<span style="display:flex;gap:6px;align-items:center">Recentes ${ICON.list}</span></div>
        <div class="sp-lib-list"></div>
      </div>`);
    const list = $('.sp-lib-list', lib);
    items.forEach(it => {
      list.append(el(`<div class="sp-lib-row${it.s === 'Artista' ? ' sp-round' : ''}"><i class="sp-sk-sq"></i><div>${bar(68)}${bar(42, 's')}</div></div>`));
    });
    nav.append(lib);
  }

  /* ================= ações ================= */
  function bgUrl(e) { const m = e && /url\("?([^")]*)"?\)\s*$/.exec(e.style.backgroundImage); return m ? m[1] : ''; }

  function setImage(target, url) {
    const k = target.dataset.k;
    const all = k ? $$(`[data-k="${CSS.escape(k)}"]`) : [target];
    all.forEach(e => {
      if (e.tagName === 'IMG') { e.removeAttribute('srcset'); e.src = url; }
      else { const b = e.style.backgroundImage, i = b.lastIndexOf('url('); e.style.backgroundImage = (i >= 0 ? b.slice(0, i) : '') + `url("${url}")`; }
    });
    if (target.matches('[data-testid="background-image"]')) themeFrom(url);
  }

  function themeFrom(url) {
    const img = new Image();
    img.onload = () => {
      const c = document.createElement('canvas'); c.width = c.height = 12;
      const x = c.getContext('2d'); x.drawImage(img, 0, 0, 12, 12);
      const d = x.getImageData(0, 0, 12, 12).data; let r = 0, g = 0, b = 0;
      for (let i = 0; i < d.length; i += 4) { r += d[i]; g += d[i + 1]; b += d[i + 2]; }
      const n = d.length / 4, f = .55;
      setTheme('#' + [r, g, b].map(v => Math.round(v / n * f).toString(16).padStart(2, '0')).join(''));
    };
    img.src = url;
  }
  function setTheme(hex) {
    S.theme = hex; save();
    const g = $('.rRzDzkFoPB1jsHaUjsDT');
    if (g) { g.style.setProperty('--background-base', hex); g.style.setProperty('--background-base-70', hex + 'b3'); g.style.setProperty('--background-base-20', hex + '33'); }
    const o = $('[data-testid="overscroll-background"]'); if (o) o.style.backgroundColor = hex + 'b3';
    const lyr = '#' + [1, 3, 5].map(i => Math.min(255, Math.round(parseInt(hex.slice(i, i + 2), 16) * 1.45)).toString(16).padStart(2, '0')).join('');
    $$('[data-testid="lyrics-npv-section"]').forEach(e => { e.style.setProperty('--lyrics-color-background', lyr); e.style.backgroundColor = lyr; });
    const lt = '#' + [1, 3, 5].map(i => Math.min(255, Math.round(parseInt(hex.slice(i, i + 2), 16) * 1.7)).toString(16).padStart(2, '0')).join('');
    root.style.setProperty('--sp-ring-a', lt); root.style.setProperty('--sp-ring-b', hex); // contorno da foto de perfil
    const inp = $('#sp-theme'); if (inp) inp.value = hex;
  }

  function fitTitle() {
    const t = $('[data-testid="adaptiveEntityTitle"] > span'); if (!t) return;
    const box = t.closest('.as3O19oHNtVHZNZ_ZPX1') || t.parentElement;
    for (const px of [96, 72, 56, 48, 40, 32]) { t.style.fontSize = px + 'px'; if (t.scrollWidth <= box.clientWidth && t.scrollHeight <= px * 1.25 * 2) break; }
  }

  function replaceText(from, to) {
    const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT); let t;
    while ((t = w.nextNode())) if (t.nodeValue.includes(from) && !t.parentElement.closest('.sp-ui')) t.nodeValue = t.nodeValue.split(from).join(to);
    $$('[aria-label]').forEach(e => { const a = e.getAttribute('aria-label'); if (a.includes(from)) e.setAttribute('aria-label', a.split(from).join(to)); });
    document.title = document.title.split(from).join(to);
  }

  // ---- biblioteca / tocando agora / sobre
  let libW = 340; // última largura da biblioteca aberta
  function toggleLib(open = !root.classList.contains('sp-lib-open'), w = libW) {
    root.classList.toggle('sp-lib-open', open);
    if (open) libW = w;
    $$('#Desktop_LeftSidebar_Id, .GUPTkKtY2KIhWSypwHYB').forEach(e => e.style.setProperty('--left-sidebar-width', open ? w : 72));
    relayout();
  }
  // redimensionar as barras laterais arrastando a linha entre elas (280–420px; abaixo disso recolhe, como no Spotify)
  function bindResize() {
    // soltar o mouse depois de arrastar (mesmo sobre um demarcador de upload) não conta como clique
    let drag = false, upAt = 0;
    addEventListener('pointerup', () => { if (drag) { drag = false; upAt = Date.now(); } }, true);
    addEventListener('click', e => { if (drag || Date.now() - upAt < 300) { e.stopPropagation(); e.preventDefault(); } }, true);
    document.addEventListener('pointerdown', e => {
      if (e.button) return;
      const bar = document.elementsFromPoint(e.clientX, e.clientY).find(x => x.matches && x.matches('.LayoutResizer__resize-bar'));
      if (!bar) return;
      const left = bar.classList.contains('LayoutResizer__inline-end');
      if (!left && root.classList.contains('sp-npv-off')) return;
      e.preventDefault(); e.stopPropagation(); drag = true;
      bar.classList.add('LayoutResizer__resize-bar--resizing'); document.body.classList.add('sp-resizing');
      const slot = $('.IZcjIS3GveeQ1JB2E7EF');
      const box = (left ? $('#Desktop_LeftSidebar_Id') : slot).getBoundingClientRect();
      const move = ev => {
        const w = Math.round((left ? ev.clientX - box.left : box.right - ev.clientX) / 10) * 10;
        if (left) {
          if (w < 200) toggleLib(false); else toggleLib(true, Math.min(420, Math.max(280, w)));
        } else if (w < 240) { toggleNpv(true); done(); } else slot.style.width = Math.min(420, Math.max(280, w)) + 'px';
        relayout();
      };
      const done = () => {
        window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', done);
        bar.classList.remove('LayoutResizer__resize-bar--resizing'); document.body.classList.remove('sp-resizing');
      };
      window.addEventListener('pointermove', move); window.addEventListener('pointerup', done);
    }, true);
  }
  // igual ao Spotify com o painel fechado ("Example 2.html"): faixa de 40px com botão para reabrir
  function toggleNpv(off = !root.classList.contains('sp-npv-off')) {
    root.classList.toggle('sp-npv-off', off);
    const box = $('.JUXAfp2JDMkv1PxyCCkK');
    if (box) { box.classList.toggle('qUbJMdiG7az31HJlXTvU', !off); box.classList.toggle('qoHJpiLKBxdnA85Ezk8q', off); box.classList.toggle('xZM6nJwKA0GZJZ87Y23h', off); }
    const panel = $('.zWzxvh50CPFKsFBEe6uX');
    if (panel) { panel.setAttribute('aria-hidden', off); panel.toggleAttribute('inert', off); }
    $('.gGu8rkkcw6DC3cXH4now')?.classList.toggle('taNdTcWVvX5omsZtsbu6', off);
    relayout();
  }
  // quantos cards cabem por linha depende da largura (o HTML salvo veio fixo em 8)
  let rlT = 0;
  function relayout() {
    clearTimeout(rlT);
    rlT = setTimeout(() => {
      $$('[data-testid="grid-container"][class*="nrVisibleCards-"]').forEach(g => {
        if (!g.offsetParent) return;
        const n = getComputedStyle(g).gridTemplateColumns.split(' ').filter(Boolean).length;
        if (n) g.className = g.className.replace(/nrVisibleCards-\d+/, 'nrVisibleCards-' + n);
      });
      $$('[style*="--column-count"]').forEach(e => {
        e.dataset.spCc ??= e.style.getPropertyValue('--column-count').trim();
        e.style.setProperty('--column-count', +e.dataset.spCc + (root.classList.contains('sp-npv-off') ? 2 : 0));
      });
    }, 350);
  }

  let slide = 0;
  function openAbout() { showSlide(0); $('#sp-about-modal').classList.add('open'); }
  function closeAbout() { $('#sp-about-modal').classList.remove('open'); }
  function showSlide(i) {
    const imgs = $$('.sp-about-media img'); slide = (i + imgs.length) % imgs.length;
    imgs.forEach((im, j) => im.classList.toggle('on', j === slide));
    $('.sp-mnext').hidden = $('.sp-mprev').hidden = imgs.length < 2;
  }

  // ---- menu do avatar
  function toggleMenu(btn) {
    const m = $('#sp-menu');
    if (m.classList.contains('open')) return m.classList.remove('open');
    const items = [['Configurações']];
    m.innerHTML = (EDIT ? `<button class="sp-mod" data-act="modify"><span>${ICON.wand}${u('modify')}</span></button><div class="sp-sep"></div>` : '') +
      items.map(([t, ext]) => t === '-' ? '<div class="sp-sep"></div>' : `<button${t === 'Configurações' ? ' data-act="settings"' : ''}><span>${tr(t)}</span>${ext ? ICON.ext : ''}</button>`).join('') +
      `<button data-act="info"><span>${u('info')}</span></button>`;
    const r = btn.getBoundingClientRect();
    m.style.top = (r.bottom + 8) + 'px'; m.style.right = (innerWidth - r.right) + 'px';
    m.classList.add('open');
  }

  // ---- pop-up Configurações (menu do avatar)
  function openSettings() {
    $('#sp-settings')?.remove();
    const m = el(`
      <div id="sp-settings" class="sp-ui" role="dialog" aria-modal="true">
        <div class="sp-set-box">
          <header><h2>${tr('Configurações')}</h2><button class="sp-x" aria-label="Close">${ICON.close}</button></header>
          <div class="sp-card">
            <div class="sp-row"><label for="sp-lang">${u('set_lang')}</label>
              <select id="sp-lang">${LI.map(l => `<option value="${l}"${l === (S.lang || 'en') ? ' selected' : ''}>${LANGS[l]}</option>`).join('')}</select></div>
            <div class="sp-row"><label for="sp-set-lib">${u('set_lib')}</label>${sw('sp-set-lib', root.classList.contains('sp-lib-open'))}</div>
            <div class="sp-row"><label for="sp-set-npv">${u('set_npv')}</label>${sw('sp-set-npv', !root.classList.contains('sp-npv-off'))}</div>
          </div>
          <p class="sp-hint">${u('set_hint')}</p>
          <h3>${u('mk_title')}</h3>
          <p class="sp-hint">${u('mk_hint')}</p>
          <div class="sp-card sp-markers">${['artist', 'ARTIST', 'listeners', 'followers', 'rank', 'year'].map(k => `<div class="sp-row"><code>[${k}]</code><span>${u('mk_' + k)}</span></div>`).join('')}</div>
          <label class="sp-faint"><input type="checkbox" id="sp-set-logo" ${root.classList.contains('sp-logo-spotify') ? 'checked' : ''}> ${u('set_logo')}</label>
        </div>
      </div>`);
    document.body.append(m);
    m.onclick = e => { if (e.target === m || e.target.closest('.sp-x')) m.remove(); };
    $('#sp-lang', m).onchange = e => { applyLang(e.target.value); openSettings(); if ($('#sp-drawer.open')) openDrawer(); };
    $('#sp-set-lib', m).onchange = e => toggleLib(e.target.checked);
    $('#sp-set-logo', m).onchange = e => root.classList.toggle('sp-logo-spotify', e.target.checked);
    $('#sp-set-npv', m).onchange = e => toggleNpv(!e.target.checked);
  }

  // aviso de boas-vindas (toda vez que abre) e também em menu > Information
  function openInfo() {
    $('#sp-info')?.remove();
    const m = el(`<div id="sp-info" class="sp-ui sp-edit-only" role="dialog" aria-modal="true"><div class="sp-info-box">
      <img class="sp-info-logo" alt="" src="${LOGO.black}">
      <h2>SpotiPreview</h2><p>${u('info_1')}</p><p>${u('info_2')}</p><h3>${u('info_h')}</h3><p>${u('info_3')}</p><p>${u('info_4')}</p>
      <footer><button class="sp-info-ok">${u('info_ok')}</button></footer></div></div>`);
    document.body.append(m);
    $('.sp-info-ok', m).onclick = () => m.remove();
    $('.sp-info-ok', m).focus();
  }
  // shortcut: detecção por user agent + toque; no celular com "site para computador" ligado o navegador já se apresenta como desktop e passa
  const isMobile = () => /Android|iPhone|iPad|iPod|Mobi/i.test(navigator.userAgent) || (matchMedia('(pointer: coarse)').matches && !matchMedia('(hover: hover)').matches && innerWidth < 900);
  function mobileGate() {
    root.classList.add('sp-blocked'); // esconde a página: sem ela o celular usa a largura real da tela
    document.body.append(el(`<div id="sp-mobile" class="sp-ui sp-edit-only"><div class="sp-info-box"><h2>SpotiPreview</h2>
      <p>SpotiPreview works best on a computer, so it can't be used on this device.</p>
      <p>Open it on a PC, or turn on <b>Desktop site</b> in your browser menu and reload the page.</p></div></div>`));
  }

  /* ================= cliques (os dois modos) ================= */
  document.addEventListener('click', e => {
    const t = e.target;
    const stop = () => { e.preventDefault(); e.stopPropagation(); };
    if (!t.closest('#sp-menu') && !t.closest('[data-testid="user-widget-link"], button:has([data-testid="user-widget-avatar"])')) $('#sp-menu')?.classList.remove('open');
    if (t.closest('.sp-ui')) return; // UI própria cuida de si

    // controles do modal
    const mc = t.closest('.sp-mctl');
    if (mc) {
      stop();
      if (mc.classList.contains('sp-mclose')) closeAbout();
      else if (mc.classList.contains('sp-mnext')) showSlide(slide + 1);
      else if (mc.classList.contains('sp-mprev')) showSlide(slide - 1);
      else if (mc.classList.contains('sp-addphoto')) pickFile(url => {
        const im = el(`<img alt="" data-k="g${Date.now()}">`); im.src = url;
        $('.sp-about-media').append(im); showSlide($$('.sp-about-media img').length - 1);
      });
      return;
    }
    if (t.id === 'sp-about-modal') { stop(); return closeAbout(); }

    // capa na barra de baixo reabre o "Tocando agora" (no Spotify é assim)
    if ((PREVIEW || root.classList.contains('sp-npv-off')) && t.closest('[data-testid="cover-art-button"]')) { stop(); return toggleNpv(); }

    if (EDIT) {
      if (t.closest('[contenteditable]')) return;
      const hit = pick(e.clientX, e.clientY);
      if (hit?.type === 'text') { stop(); return startEdit(hit.el); }
      if (hit?.type === 'img' && !hit.el.matches('[data-sp-card]')) { stop(); return pickFile(url => setImage(hit.el, url), hit.el); }
    }

    // controles podem estar cobertos por camadas invisíveis: procura em tudo que está sob o cursor
    const stack = document.elementsFromPoint(e.clientX, e.clientY);
    const at = sel => { for (const x of stack) { const m = x.closest(sel); if (m) return m; } return null; };
    const avatar = at('[data-testid="user-widget-link"], button:has([data-testid="user-widget-avatar"])');
    if (avatar) { stop(); return toggleMenu(avatar); }
    if (at('[aria-label="Abrir Sua Biblioteca"], .sp-lib-collapse')) { stop(); return toggleLib(); }
    if (at('[aria-label="Ocultar a tela Tocando agora"], [aria-label="Mostrar a tela Tocando agora"], [data-testid="now-playing-bar"] [aria-label="Tela Tocando agora"]')) { stop(); return toggleNpv(); }
    if (t.closest('[data-sp-card]')) { stop(); hideHover(); return openAbout(); }
    if (t.closest('a, button, [role="button"]')) e.preventDefault(); // nada sai da página
  }, true);
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !editing) { closeAbout(); $('#sp-menu')?.classList.remove('open'); $('#sp-settings')?.remove(); $('#sp-info')?.remove(); $('#sp-drawer')?.classList.remove('open'); } });

  /* ================= só no modo edição ================= */
  let editing = null, before = '';
  const NOEDIT = '[data-testid="global-nav-bar"], .sp-mctl, #Desktop_LeftSidebar_Id, .sp-ui, .sp-disclaimer, .sp-sk-h, .sp-sk-img, [data-encore-id="buttonSecondary"], svg, input, textarea';
  const isText = e => !e.closest(NOEDIT) && (e.dataset.spField || (!e.children.length && /\S/.test(e.textContent) && e.closest('#main, #sp-about-modal')));
  const isImg = e => !e.closest('[data-testid="global-nav-bar"], #Desktop_LeftSidebar_Id, .sp-ui') && (e.tagName === 'IMG' || (e.dataset.k && e.style.backgroundImage.includes('url(')));
  // o banner fica atrás da página inteira: só vale como alvo enquanto o cursor está sobre o cabeçalho
  const overHeader = (x, y) => {
    const h = $('[data-testid="entity-header"]'); if (!h) return true;
    const r = h.getBoundingClientRect(); return x >= r.left && x <= r.right && y >= r.top && y <= r.bottom;
  };
  function pick(x, y) {
    for (const e of document.elementsFromPoint(x, y)) {
      if (e.closest('.sp-ui') || e.id === 'sp-about-modal') return null;
      if (e.matches('[data-testid="background-image"]') && !overHeader(x, y)) continue;
      if (isText(e)) return { type: 'text', el: e };
      if (isImg(e)) return { type: 'img', el: e };
    }
    return null;
  }

  function pickFile(cb, target) {
    $('#sp-file')?.remove();
    const inp = el('<input type="file" accept="image/*" id="sp-file" class="sp-ui sp-edit-only" style="display:none">');
    inp.onchange = () => { readImg(inp.files[0], cb, target); inp.remove(); };
    document.body.append(inp);
    inp.click();
  }
  const toURL = b => new Promise(res => { const r = new FileReader(); r.onload = () => res(r.result); r.readAsDataURL(b); });
  // imagens enormes travam a página e incham o .html baixado: reduz ao tamanho que a página usa e grava em WebP (qualidade 95).
  // shortcut: WebP no lugar de JXL (nenhum navegador gera nem mostra JXL de forma confiável), sem WebP no canvas (Safari) mantém o original.
  async function optimize(f, max) {
    const orig = { url: await toURL(f) };
    if (/gif|svg/.test(f.type)) return orig; // animação e vetor ficam como estão
    let bmp; try { bmp = await createImageBitmap(f); } catch { return orig; }
    const k = Math.min(1, max / Math.max(bmp.width, bmp.height));
    if (k === 1 && f.size < 3e5) { bmp.close(); return orig; } // já é pequena
    const c = document.createElement('canvas'); c.width = Math.round(bmp.width * k); c.height = Math.round(bmp.height * k);
    const x = c.getContext('2d'); x.imageSmoothingQuality = 'high'; x.drawImage(bmp, 0, 0, c.width, c.height); bmp.close();
    const blob = await new Promise(r => c.toBlob(r, 'image/webp', .95));
    if (!blob || blob.type !== 'image/webp' || blob.size >= f.size) return orig;
    return { url: await toURL(blob) };
  }
  function readImg(f, cb, target) {
    if (!f || !f.type.startsWith('image/')) return;
    optimize(f, target?.matches('[data-testid="background-image"]') ? 2660 : 1600).then(r => cb(r.url));
  }

  function startEdit(e) {
    hideHover();
    const b = e.closest('button'); if (b) unbutton(b);
    editing = e; before = e.textContent;
    const f = e.dataset.spField;
    if (NUM[f]) e.textContent = full(S[f]);
    e.contentEditable = 'plaintext-only';
    e.classList.add('sp-editing');
    e.focus();
    const sel = getSelection(), rg = document.createRange(); rg.selectNodeContents(e); sel.removeAllRanges(); sel.addRange(rg);
  }
  function endEdit(cancel) {
    const e = editing; if (!e) return;
    editing = null;
    e.removeAttribute('contenteditable'); e.classList.remove('sp-editing');
    const f = e.dataset.spField, v = e.textContent.trim();
    if (cancel || (!v && f !== 'bio')) { e.textContent = before; if (f) render(f); return; }
    if (f === 'name') { if (before.trim() && before.trim() !== v) replaceText(before.trim(), v); S.name = v; fitTitle(); }
    else if (NUM[f]) { const n = digits(v); if (!isNaN(n)) S[f] = f === 'rank' ? Math.max(1, n) : n; render(f); syncDrawer(); }
    else if (f === 'bio') { S.bio = expand(e.innerText.trim()); render('bio'); }
    else if (f === 'song') { S.song = expand(v); render('song'); }
    else if (!f && expand(v) !== v) e.textContent = expand(v);
    save();
  }
  function bindEdit() {
    document.addEventListener('focusout', e => { if (e.target === editing) endEdit(false); });
    document.addEventListener('keydown', e => {
      if (!editing) return;
      if (e.key === 'Escape') { e.preventDefault(); endEdit(true); }
      else if (e.key === 'Enter' && !(editing.dataset.spField === 'bio' && e.shiftKey)) { e.preventDefault(); editing.blur(); }
      else if (NUM[editing.dataset.spField] && e.key.length === 1 && !/[\d.]/.test(e.key) && !e.ctrlKey) e.preventDefault();
    }, true);

    // realce ao passar o mouse
    const frame = el('<div id="sp-frame" class="sp-ui"><span></span></div>');
    const tip = el('<div id="sp-tip" class="sp-ui"></div>');
    document.body.append(frame, tip);
    let raf = 0, mx = 0, my = 0, dragging = false;
    const show = (hit, drop) => {
      if (!hit || editing) return hideHover();
      const r = visibleRect(hit.el);
      if (hit.el.matches('[data-sp-card]') && !drop) { // card "Sobre": só uma dica, sem moldura por cima
        frame.style.display = 'none'; tip.textContent = u('tip_card'); tip.style.display = 'block';
        tip.style.left = r.left + 12 + 'px'; tip.style.top = r.top + 12 + 'px'; return;
      }
      Object.assign(frame.style, { display: 'flex', left: r.left - 3 + 'px', top: r.top - 3 + 'px', width: r.width + 6 + 'px', height: r.height + 6 + 'px' });
      const txt = hit.type === 'text';
      frame.className = 'sp-ui' + (txt ? ' sp-text' : '') + (drop ? ' sp-drop' : '') + (hit.el.id === 'sp-profile' ? ' sp-round' : '') + (r.width < 90 || r.height < 60 ? ' sp-small' : '');
      const banner = hit.el.matches('[data-testid="background-image"]');
      frame.firstChild.textContent = txt ? '' : drop ? u('drop') : r.width < 90 || r.height < 60 ? '⬆' :
        hit.el.matches('[data-sp-card]') ? u('drag_card') : u(banner ? 'drag_banner' : 'drag_img');
      frame.firstChild.style.display = txt ? 'none' : '';
      if (banner) { frame.firstChild.style.alignSelf = 'flex-start'; frame.firstChild.style.marginTop = '70px'; } else { frame.firstChild.style.alignSelf = ''; frame.firstChild.style.marginTop = ''; }
      tip.style.display = txt ? 'block' : 'none';
      if (txt) { tip.textContent = u('tip_edit'); tip.style.left = r.left + 'px'; tip.style.top = Math.max(4, r.top - 30) + 'px'; }
    };
    document.addEventListener('mousemove', e => {
      mx = e.clientX; my = e.clientY;
      if (!raf) raf = requestAnimationFrame(() => { raf = 0; if (!dragging) show(pick(mx, my)); });
    }, true);
    document.addEventListener('scroll', hideHover, true);
    document.addEventListener('mouseleave', hideHover);

    // arrastar e soltar arquivos de imagem
    const files = e => e.dataTransfer && [...e.dataTransfer.types].includes('Files');
    document.addEventListener('dragover', e => {
      if (!files(e)) return;
      e.preventDefault(); dragging = true;
      const hit = pick(e.clientX, e.clientY);
      e.dataTransfer.dropEffect = hit?.type === 'img' ? 'copy' : 'none';
      show(hit?.type === 'img' ? hit : null, true);
    }, true);
    document.addEventListener('dragleave', e => { if (!e.relatedTarget) { dragging = false; hideHover(); } });
    document.addEventListener('drop', e => {
      if (!files(e)) return;
      e.preventDefault(); dragging = false; hideHover();
      const hit = pick(e.clientX, e.clientY);
      if (hit?.type === 'img') readImg(e.dataTransfer.files[0], url => setImage(hit.el, url), hit.el);
    }, true);

    // botão Preview
    const pv = el(`<button id="sp-preview-btn" class="sp-ui sp-edit-only">${ICON.eye}<span data-ui="preview_btn"></span></button>`);
    pv.onclick = openPreview;
    document.body.append(pv);

  }
  // retângulo realmente visível (o banner é maior que a área que aparece)
  function visibleRect(e) {
    const b = e.getBoundingClientRect(); let l = b.left, t = b.top, r = b.right, btm = b.bottom;
    for (let p = e.parentElement; p && p !== document.body; p = p.parentElement) {
      const c = getComputedStyle(p);
      if (c.overflowX !== 'visible' || c.overflowY !== 'visible') {
        const q = p.getBoundingClientRect();
        l = Math.max(l, q.left); t = Math.max(t, q.top); r = Math.min(r, q.right); btm = Math.min(btm, q.bottom);
      }
    }
    return { left: l, top: t, width: Math.max(0, r - l), height: Math.max(0, btm - t) };
  }
  function hideHover() { const f = $('#sp-frame'), t = $('#sp-tip'); if (f) f.style.display = 'none'; if (t) t.style.display = 'none'; }

  /* ================= gaveta "Modificar página" ================= */
  const sw = (id, on) => `<span class="sp-switch"><input type="checkbox" id="${id}" ${on ? 'checked' : ''}><i></i></span>`;
  function openDrawer() {
    let d = $('#sp-drawer');
    if (!d) { d = el('<aside id="sp-drawer" class="sp-ui sp-edit-only"></aside>'); document.body.append(d); }
    const blocks = $$('#sp-sections > [data-sp-block]');
    d.innerHTML = `
      <header><div><h2>${u('modify')}</h2><small>${u('d_sub')}</small></div>
        <button class="sp-x" aria-label="Close">${ICON.close.replace('<svg', '<svg width="16" height="16" fill="currentColor"')}</button></header>
      <div class="sp-body">
        <h3>${tr('Perfil')}</h3>
        <div class="sp-card">
          <div class="sp-row"><label for="sp-verified">${tr('Verificado pelo Spotify')}</label>${sw('sp-verified', !root.classList.contains('sp-noverified'))}</div>
          <div class="sp-row"><label for="sp-prof">${u('set_prof')}</label>${sw('sp-prof', root.classList.contains('sp-profile-on'))}</div>
          <div class="sp-row"><label for="sp-rankon">${u('d_rank')}</label><input type="number" min="1" class="sp-rankin" id="sp-rank" value="${S.rank}">${sw('sp-rankon', !root.classList.contains('sp-norank'))}</div>
          <div class="sp-row"><label for="sp-listeners">${tr('Ouvintes mensais')}</label><input type="number" min="0" id="sp-listeners" value="${S.listeners}"></div>
          <div class="sp-row"><label for="sp-followers">${tr('Seguidores')}</label><input type="number" min="0" id="sp-followers" value="${S.followers}"></div>
          <div class="sp-row"><label for="sp-theme">${u('d_theme')} <span style="color:#8a8a8a;font-size:12px">${u('d_theme_auto')}</span></label><input type="color" id="sp-theme" value="${S.theme || '#353535'}"></div>
        </div>
        <h3>${u('d_sections')}</h3>
        <div id="sp-blocks">${blocks.map((b, i) => {
          const units = b.matches('[data-sp-sec]') ? [b] : $$('[data-sp-sec]', b);
          return `<div class="sp-block" data-i="${i}"><span class="sp-grip" draggable="true" title="${u('grip')}">⋮⋮</span><div class="sp-units">${
            units.map(un => {
              const g = $('[data-testid="grid-container"]', un);
              const cnt = g ? `<input type="number" min="1" max="${MAXCARDS}" class="sp-count" data-sec="${un.dataset.spSec}" title="${u('cnt')}" value="${[...g.children].filter(c => !c.classList.contains('sp-off')).length}">` : '';
              return `<div class="sp-row"><label for="sw-${un.dataset.spSec}">${escapeHtml($('h2', un)?.textContent.trim() || '')}</label>${cnt}${sw('sw-' + un.dataset.spSec, !un.classList.contains('sp-off'))}</div>`;
            }).join('')
          }</div></div>`;
        }).join('')}</div>
        <p class="sp-hint">${u('d_count')}</p>
        <p class="sp-hint">${u('d_tip')}</p>
      </div>
      <footer><button class="sp-btn-ghost" id="sp-dl">${u('d_dl')}</button><button class="sp-btn-main" id="sp-open-pv">${u('d_open')}</button></footer>`;

    $('.sp-x', d).onclick = () => d.classList.remove('open');
    $('#sp-open-pv', d).onclick = openPreview;
    $('#sp-dl', d).onclick = download;
    $('#sp-verified', d).onchange = e => root.classList.toggle('sp-noverified', !e.target.checked);
    $('#sp-prof', d).onchange = e => root.classList.toggle('sp-profile-on', e.target.checked);
    $('#sp-rankon', d).onchange = e => root.classList.toggle('sp-norank', !e.target.checked);
    $('#sp-theme', d).oninput = e => setTheme(e.target.value);
    ['rank', 'listeners', 'followers'].forEach(f => $('#sp-' + f, d).oninput = e => {
      const n = digits(e.target.value); if (isNaN(n)) return; S[f] = f === 'rank' ? Math.max(1, n) : n; render(f); save();
    });
    $$('.sp-count', d).forEach(c => c.onchange = () => { c.value = setCount($(`[data-sp-sec="${c.dataset.sec}"] [data-testid="grid-container"]`), +c.value); });
    $$('[id^="sw-"]', d).forEach(c => c.onchange = () => { $(`[data-sp-sec="${c.id.slice(3)}"]`).classList.toggle('sp-off', !c.checked); relayout(); });

    // reordenar seções arrastando
    let from = null;
    $$('.sp-block', d).forEach(b => {
      b.ondragstart = e => { from = b; b.classList.add('sp-dragging'); e.dataTransfer.effectAllowed = 'move'; e.dataTransfer.setData('text/plain', ''); };
      b.ondragend = () => { from = null; $$('.sp-block', d).forEach(x => x.classList.remove('sp-dragging', 'sp-over')); };
      b.ondragover = e => { if (!from) return; e.preventDefault(); $$('.sp-block', d).forEach(x => x.classList.toggle('sp-over', x === b && x !== from)); };
      b.ondrop = e => {
        e.preventDefault(); if (!from || from === b) return;
        const list = $('#sp-blocks', d), page = $('#sp-sections');
        const pageBlocks = $$('#sp-sections > [data-sp-block]');
        const a = pageBlocks[+from.dataset.i], z = pageBlocks[+b.dataset.i];
        const down = [...list.children].indexOf(from) < [...list.children].indexOf(b);
        list.insertBefore(from, down ? b.nextSibling : b);
        page.insertBefore(a, down ? z.nextSibling : z);
        // reindexa pela ordem atual da página
        const now = $$('#sp-sections > [data-sp-block]');
        [...list.children].forEach(x => { const orig = pageBlocks[+x.dataset.i]; x.dataset.i = now.indexOf(orig); });
      };
    });
    requestAnimationFrame(() => d.classList.add('open'));
  }
  // mostra N cards: esconde os extras ou clona o último com imagem própria (senão trocar a foto mudaria os dois)
  const MAXCARDS = 10;
  const PH = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Crect width='100%25' height='100%25' fill='%23535353'/%3E%3C/svg%3E";
  function setCount(g, n) {
    n = Math.max(1, Math.min(MAXCARDS, n || 1));
    while (g.children.length < n) {
      const c = g.lastElementChild.cloneNode(true);
      $$('img', c).forEach((im, j) => { im.dataset.k = `c${Date.now()}-${g.children.length}-${j}`; im.removeAttribute('srcset'); im.src = PH; });
      c.classList.remove('sp-off');
      g.append(c);
    }
    [...g.children].forEach((c, i) => c.classList.toggle('sp-off', i >= n));
    return n;
  }
  function syncDrawer() { ['rank', 'listeners', 'followers'].forEach(f => { const i = $('#sp-' + f); if (i) i.value = S[f]; }); }
  const escapeHtml = s => s.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  /* ================= preview / download ================= */
  function snapshot() {
    if (editing) editing.blur();
    hideHover();
    $('#sp-menu')?.classList.remove('open');
    const c = root.cloneNode(true);
    $$('.sp-edit-only, #sp-frame, #sp-tip', c).forEach(e => e.remove());
    $$('[contenteditable]', c).forEach(e => e.removeAttribute('contenteditable'));
    $$('.sp-editing', c).forEach(e => e.classList.remove('sp-editing'));
    c.classList.remove('sp-edit');
    c.setAttribute('data-sp-preview', '');
    $('#sp-about-modal', c)?.classList.remove('open');
    const base = document.createElement('base'); base.href = location.href.replace(/[^/]*$/, '');
    c.querySelector('head').prepend(base);
    return '<!DOCTYPE html>\n<!-- Made with SpotiPreview — prévia NÃO oficial, não é uma página real do Spotify -->\n' + c.outerHTML;
  }
  function openPreview() {
    const w = window.open('', '_blank');
    if (!w) return alert('O navegador bloqueou a nova aba. Permita pop-ups para este arquivo e tente de novo.');
    w.document.open(); w.document.write(snapshot()); w.document.close();
  }
  function download() {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([snapshot()], { type: 'text/html' }));
    a.download = `SpotiPreview - ${S.name || 'artista'}.html`;
    a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 5000);
  }

  /* ================= aviso verde: onde achar as outras opções ================= */
  function showGuide() {
    const av = $('[data-testid="user-widget-link"], button:has([data-testid="user-widget-avatar"])');
    if (!av || $('#sp-guide')) return;
    const g = el(`<div id="sp-guide" class="sp-ui sp-edit-only"><span data-ui="guide"></span></div>`);
    document.body.append(g); refreshUI();
    const place = () => { const r = av.getBoundingClientRect(); g.style.top = r.bottom + 12 + 'px'; g.style.right = Math.max(8, innerWidth - r.right - 4) + 'px'; g.style.setProperty('--arrow', Math.round(r.width / 2 + 4) + 'px'); };
    place(); addEventListener('resize', place);
    const AV = '[data-testid="user-widget-link"], button:has([data-testid="user-widget-avatar"])';
    document.addEventListener('click', e => { if (document.elementsFromPoint(e.clientX, e.clientY).some(x => x.closest(AV))) g.remove(); }, true);
    g.onclick = () => g.remove();
  }

  /* ================= início ================= */
  function init() {
    if (!root.dataset.sp) build(); // o preview já chega montado
    if (PREVIEW) $$('#sp-frame, #sp-tip, .sp-edit-only').forEach(e => e.remove());
    if (S.lang) root.lang = LOCALE[S.lang];
    refreshUI();
    ['name', 'listeners', 'followers', 'rank', 'bio', 'song'].forEach(render);
    if (S.theme) setTheme(S.theme);
    fitTitle(); addEventListener('resize', fitTitle);
    if (EDIT) { root.classList.add('sp-edit'); bindEdit(); }
    $('#sp-menu').addEventListener('click', e => {
      const a = e.target.closest('[data-act]')?.dataset.act; if (!a) return;
      $('#sp-menu').classList.remove('open');
      if (a === 'modify') openDrawer(); else if (a === 'info') openInfo(); else openSettings();
    });
    addEventListener('resize', relayout); relayout(); bindResize();
    if (EDIT) { if (isMobile()) mobileGate(); else openInfo(); showGuide(); }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
