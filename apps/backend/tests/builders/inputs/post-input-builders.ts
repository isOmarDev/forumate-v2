import { faker } from '@faker-js/faker';
import z from 'zod';

import { LinkPostSchema, PostTypeSchema, TextPostSchema } from '@forumate/api';

type TextPostInput = z.infer<typeof TextPostSchema>;
type LinkPostInput = z.infer<typeof LinkPostSchema>;

export class CreateTextPostInputBuilder {
  private props: TextPostInput = {
    title: faker.lorem.words({ min: 3, max: 8 }),
    content: faker.lorem.sentences({ min: 2, max: 5 }),
    postType: PostTypeSchema.enum.text,
    memberId: faker.string.uuid(),
  };

  withTitle(title: string): this {
    this.props.title = title;
    return this;
  }

  withContent(content: string): this {
    this.props.content = content;
    return this;
  }

  withMemberId(memberId: string): this {
    this.props.memberId = memberId;
    return this;
  }

  build() {
    return this.props;
  }
}

export class CreateLinkPostInputBuilder {
  private props: LinkPostInput = {
    title: faker.lorem.words({ min: 3, max: 8 }),
    link: faker.internet.url(),
    postType: PostTypeSchema.enum.link,
    memberId: faker.string.uuid(),
  };

  withTitle(title: string): this {
    this.props.title = title;
    return this;
  }

  withLink(link: string): this {
    this.props.link = link;
    return this;
  }

  withMemberId(memberId: string): this {
    this.props.memberId = memberId;
    return this;
  }

  build() {
    return this.props;
  }
}
