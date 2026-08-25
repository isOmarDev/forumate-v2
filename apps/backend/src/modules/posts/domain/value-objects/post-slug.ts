import { NumberUtil, TextUtil, ValueObject } from '@forumate/core';

type PostSlugProps = {
  value: string;
};

export class PostSlug extends ValueObject<PostSlugProps> {
  constructor(props: PostSlugProps) {
    super(props);
  }

  get value() {
    return this.props.value;
  }

  public static create(title: string) {
    const hash = NumberUtil.generateRandomInteger(10000, 999999);
    const kebabCase = TextUtil.kebabCase(title);
    const value = `${kebabCase}-${hash}`;
    return new PostSlug({ value });
  }

  public static toDomain(value: string): PostSlug {
    return new PostSlug({ value });
  }
}
