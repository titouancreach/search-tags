import * as vscode from "vscode";
import { either as E } from "fp-ts";
import { P, match } from "ts-pattern";
import { pipe } from "fp-ts/lib/function";
import { reduce } from "fp-ts/lib/Array";

type Token =
  | { type: "class"; value: string }
  | { type: "id"; value: string }
  | { type: "tag"; value: string };

function lex(str: string): E.Either<string, Token[]> {
  return match(str)
    .with(P.string.regex(/^\.[a-zA-Z0-9_-]+/).select(), (x) => {
      const matched = x.match(/^\.([a-zA-Z0-9_-]+)/);
      const rest = x.slice(matched![0].length);

      return match(lex(rest))
        .with(
          {
            _tag: "Right",
            right: P.array(P.any).select(),
          },
          (nextTokens) => {
            return E.right([
              { type: "class", value: matched![1] } as const,
              ...nextTokens,
            ]);
          }
        )
        .with(P.any.select(), (x) => {
          return E.left("Invalid abbreviation");
        })
        .exhaustive();
    })
    .with("", () => {
      return E.right([]);
    })
    .with(P.any.select(), (x) => {
      return E.left("Invalid abbreviation");
    })
    .exhaustive();
}

function escapeRegExp(str: string) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string
}

function checkTokens(tokens: Token[]): E.Either<string, Token[]> {
  // The first token should be a tag, a class or an id.
  // All the remaining tokens should be either a class or an id.
  // There should be at least one token
  return match(tokens)
    .with(
      [
        { type: P.union("tag", "class", "id") },
        ...P.array({ type: P.union("class", "id") }),
      ],
      () => E.right(tokens)
    )
    .with([], () => E.left("Empty abbreviation"))
    .with([P.any], () => E.left("Tokens are in the wrong order"))
    .otherwise(() => E.left("Invalid abbreviation"));
}

export function activate(context: vscode.ExtensionContext) {
  console.log(
    'Congratulations, your extension "search-tags.search" is now active!'
  );

  let disposable = vscode.commands.registerCommand(
    "search-tags.search",
    async () => {
      const emmetAbbr = await vscode.window.showInputBox({
        title: "Search",
        placeHolder: "Emmet abbreviation",
      });

      if (!emmetAbbr) {
        return;
      }

      const tokens = pipe(emmetAbbr, lex, E.flatMap(checkTokens));

      const regex = pipe(
        tokens,
        E.map((tokens) => {
          return pipe(
            tokens,
            reduce("", (acc: string, token: Token) => {
              return match(token)
                .with(
                  { type: "class", value: P.string.select() },
                  (v) => `${acc}(?=.*?${escapeRegExp(v)})`
                )
                .otherwise(() => {
                  // Token not yet implemented, we don't know to build or regex for it
                  return acc;
                });
            })
          );
        }),
        E.map((x) => {
          return `className=${x}.*`;
        })
      );

      pipe(
        regex,
        E.tap((x) => {
          vscode.env.clipboard.writeText(x);
          vscode.window.showInformationMessage("Regex copied to clipboard");
          return E.right(""); // ??????????,
        })
      );
    }
  );

  context.subscriptions.push(disposable);
}

export function deactivate() {}
