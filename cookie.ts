interface ICookie {
  get(key: string): string | null;
  set(key: string, value: any, days: number, path: string): void;
  delete(key: string): void;
}

interface IObject {
  [key: string]: string
}

class Cookie implements ICookie {
  get(key: string) {
    if (document.cookie.length) {
      let map = document.cookie.split(';').reduce((acc: IObject, current) => {
        if (current.length) {
          let [k, v] = current.split('=');
          acc[k] = decodeURIComponent(v);
        }
        return acc
      }, {});

      return map[key] || null
    }

    return null;
  }

  set(key: string, value: any, days: number, path: string = "/") {
    let expires = '';

    if (days) {
      let date = new Date();
      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
      expires = `; expires=${date.toUTCString()}`;
    }

    document.cookie = `${key}=${encodeURIComponent(value)}${expires}; path=${path}`
  }

  delete(key: string): void {
    this.set(key, '', -1);
  }
}