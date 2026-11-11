import { faker } from '@faker-js/faker';
import z from 'zod';

import { LinkPostSchema, postTypeSchema, TextPostSchema } from '@forumate/api';

type PostInput = { title: string; memberId: string; postType: string };
type TextPostInput = z.infer<typeof TextPostSchema>;
type LinkPostInput = z.infer<typeof LinkPostSchema>;

abstract class BasePostInputBuilder<T extends PostInput> {
  protected props: T;

  constructor(defaultProps: T) {
    this.props = defaultProps;
  }

  withTitle(title: string): this {
    this.props.title = title;
    return this;
  }

  withMemberId(memberId: string): this {
    this.props.memberId = memberId;
    return this;
  }

  build(): T {
    return this.props;
  }
}

class CreateTextPostInputBuilder extends BasePostInputBuilder<TextPostInput> {
  constructor() {
    super({
      title: faker.lorem.words({ min: 3, max: 8 }),
      content: faker.lorem.sentences({ min: 2, max: 5 }),
      postType: postTypeSchema.enum.text,
      memberId: faker.string.uuid(),
    });
  }

  withContent(content: string): this {
    this.props.content = content;
    return this;
  }
}

class CreateLinkPostInputBuilder extends BasePostInputBuilder<LinkPostInput> {
  constructor() {
    super({
      title: faker.lorem.words({ min: 3, max: 8 }),
      link: faker.internet.url({ protocol: 'https' }),
      postType: postTypeSchema.enum.link,
      memberId: faker.string.uuid(),
    });
  }

  withLink(link: string): this {
    this.props.link = link;
    return this;
  }
}

export class CreatePostInputBuilder {
  static aTextPost(): CreateTextPostInputBuilder {
    return new CreateTextPostInputBuilder();
  }
  static aLinkPost(): CreateLinkPostInputBuilder {
    return new CreateLinkPostInputBuilder();
  }
}
