export class userInformation {
    constructor(private name = '', private gender = '', private id = undefined) {
    }
    getName(): string {
        return this.name;
    }
    setName(name: string) {
        this.name = name;
    }
    getGender(): string {
        return this.gender;
    }
    setGender(gender: string) {
        this.gender = gender;
    }
    getId(): string {
        return this.id;
    }
    setId(id: string) {
        this.id = id;
    }
}