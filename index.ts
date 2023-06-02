enum TokenKind {
  // structural tokens
  R_BRACE,
  L_BRACE,
  R_BRACKET,
  L_BRACKET,
  COLON,
  COMMA,

  // literal
  STRING,
  NUMBER,

  // value
  TRUE,
  FALSE,
  NULL,
}

interface TokenWithoutLiteral {
  kind: Exclude<TokenKind, TokenKind.NUMBER | TokenKind.STRING>
}

interface TokenWithLiteral {
  kind: TokenKind.NUMBER | TokenKind.STRING,
  literal: string
}

type Token = TokenWithLiteral | TokenWithoutLiteral;
class TokenStream {
  at: number;
  text: string;

  constructor(text: string) {
    this.at = 0;
    this.text = text;
  }

  public get(): Token {
    this.consumeWS();
    const char = this.peek();
    switch (char) {
      case ":":
        return {
          kind: TokenKind.COLON,
        };
      case ",":
        return {
          kind: TokenKind.COMMA,
        };
      case "[":
        return {
          kind: TokenKind.L_BRACKET,
        };
      case "]":
        return {
          kind: TokenKind.R_BRACKET,
        };
      case "{":
        return {
          kind: TokenKind.L_BRACE,
        };
      case "}":
        return {
          kind: TokenKind.R_BRACE,
        };
      case "t": {
        if (
          this.peek(1) === "r" &&
          this.peek(2) === "u" &&
          this.peek(3) === "e"
        ) {
          return {
            kind: TokenKind.TRUE,
          };
        }
      }
      case "f": {
        if (
          this.peek(1) === "a" &&
          this.peek(2) === "l" &&
          this.peek(3) === "s" &&
          this.peek(4) === "e"
        ) {
          return {
            kind: TokenKind.FALSE,
          };
        }
      }
      case "n": {
        if (
          this.peek(1) === "u" &&
          this.peek(2) === "l" &&
          this.peek(3) === "l"
        ) {
          return {
            kind: TokenKind.NULL,
          };
        }
      }
      case "-":
      case "0":
      case "1":
      case "2":
      case "3":
      case "4":
      case "5":
      case "6":
      case "7":
      case "8":
      case "9": {
        let literal = char;
        let i = 1;

        const numChars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.', 'e', 'E', '+', '-'];

        // TODO: need more graceful handling here
        while (numChars.includes(this.peek(i))) {
          console.log(this.peek(i));
          literal += this.peek(i);
          i++;
        }

        return {
          kind: TokenKind.NUMBER,
          literal
        };
      }
      case '"': {
        let literal = "";
        let i = 1;
        while (this.peek(i) !== '"') {
          literal += this.peek(i);
          i++;
        }

        return {
          kind: TokenKind.STRING,
          literal
        };
      }
      default:
        throw Error(`${char} bad token`);
    }
  }

  public consume(kind?: TokenKind): Token {
    const t: Token = this.get();
    if (kind && t.kind !== kind) {
      throw Error(`expected ${kind} but got ${t.kind}`);
    }

    // forward at
    switch (t.kind) {
      case TokenKind.COLON:
      case TokenKind.COMMA:
      case TokenKind.L_BRACE:
      case TokenKind.R_BRACE:
      case TokenKind.L_BRACKET:
      case TokenKind.R_BRACKET:
        this.at++;
        break;
      case TokenKind.NULL:
        this.at += 4;
        break;
      case TokenKind.FALSE:
        this.at += 5;
        break;
      case TokenKind.TRUE:
        this.at += 4;
        break;
      case TokenKind.NUMBER:
        this.at += t.literal.length || 0;
        break;
      case TokenKind.STRING:
        this.at += t.literal.length + 2 || 0;
        break;
    }
    return t;
  }

  private consumeWS(): void {
    while (this.peek() === " ") {
      this.at ++;
    }
  }

  private peek(index: number = 0): string {
    return this.text.charAt(this.at + index);
  }
}

class Parser {
  ts: TokenStream;
  constructor(text: string) {
    this.ts = new TokenStream(text);
  }

  public parse(): any {
    return this.parseValue();
  }

  private parseValue(): any {
    const t = this.ts.get();
    switch (t.kind) {
      case TokenKind.L_BRACKET:
        return this.parseArray();
      case TokenKind.L_BRACE:
        return this.parseObject();
      case TokenKind.STRING:
        return this.parseString();
      case TokenKind.NUMBER:
        return this.parseNumber();
      case TokenKind.TRUE:
        return true;
      case TokenKind.FALSE:
        return false;
      case TokenKind.NULL:
        return null;
      default:
        throw Error("unexpected value");
    }
  }

  private parseString(): string {
    const t = this.ts.consume(TokenKind.STRING) as TokenWithLiteral;
    return t.literal;
  }

  private parseNumber(): number {
    const t = this.ts.consume(TokenKind.NUMBER) as TokenWithLiteral;
    return Number(t.literal);
  }

  private parseObject(): any {
    const obj: {[key: string]: any} = {};

    this.ts.consume(TokenKind.L_BRACE);
    while (this.ts.get().kind !== TokenKind.R_BRACE) {
      const key = this.ts.consume(TokenKind.STRING) as TokenWithLiteral;
      this.ts.consume(TokenKind.COLON);
      obj[key.literal] = this.parseValue();

      if (this.ts.get().kind === TokenKind.R_BRACE) {
        break;
      }

      this.ts.consume(TokenKind.COMMA);
    }
    this.ts.consume(TokenKind.R_BRACE);

    return obj;
  }

  private parseArray(): any[] {
    const arr: any[] = [];

    this.ts.consume(TokenKind.L_BRACKET);
    while (this.ts.get().kind !== TokenKind.R_BRACKET) {
      arr.push(this.parseValue());
      if (this.ts.get().kind === TokenKind.R_BRACKET) {
        break;
      }

      this.ts.consume(TokenKind.COMMA);
    }
    this.ts.consume(TokenKind.R_BRACKET);

    return arr;
  }
}

export const parse = (text: string): any => {
  const parser = new Parser(text);
  return parser.parse();
};
