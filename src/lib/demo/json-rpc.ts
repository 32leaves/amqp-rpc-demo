
export interface HelloWorld {
    hello(): string;
    helloWho(person: Person): PersonWithHello;
    helloError(): void;
}

export interface Person {
    first: string;
    last: string;
}

export type PersonWithHello = Person & { hello: string }
