export class UserTopicPayload {
  public id: number
  public email: string
  public code: string
  public first_name: string
  public last_name: string
  public phone: string
  public profile_picture: string
  public address: string

  constructor(
    id: number,
    email: string,
    code: string,
    first_name: string,
    last_name: string,
    phone: string,
    profile_picture: string,
    address: string
  ) {
    this.id = id
    this.email = email
    this.code = code
    this.first_name = first_name
    this.last_name = last_name
    this.phone = phone
    this.profile_picture = profile_picture
    this.address = address
  }
}
