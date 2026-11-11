import { faker } from '@faker-js/faker';

import { PostCommentInput } from '@forumate/api/comments';

export class PostCommentInputBuilder {
  private props: PostCommentInput = {
    body: faker.lorem.paragraphs(3),
    memberId: faker.string.uuid(),
    postId: faker.string.uuid(),
    parentCommentId: undefined,
  };

  public withMemberId(id: string) {
    this.props.memberId = id;
    return this;
  }

  public withPostId(id: string) {
    this.props.postId = id;
    return this;
  }

  public withParentCommentId(id?: string) {
    this.props.parentCommentId = id;
    return this;
  }

  public withBody(body: string) {
    this.props.body = body;
    return this;
  }

  public build(): PostCommentInput {
    return this.props;
  }
}
