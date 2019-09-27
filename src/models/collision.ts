enum Collision {
  None = 0,
  Top = 1,
  Right = 2,
  Bottom = 4,
  Left = 8,
  TopRight = 3,
  TopLeft = 9,
  BottomLeft = 12,
  BottomRight = 6,
  TopU = 11,
  RightU = 7,
  BottomU = 14,
  LeftU = 13,
  TopBottom = 5,
  LeftRight = 10,
  All = 15
}

export default Collision;